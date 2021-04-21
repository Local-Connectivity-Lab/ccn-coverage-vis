import csv
import enum
import random
import json

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone, tzinfo
from typing import Any, Dict, List
from math import radians, degrees, sin, cos, atan2, asin, sqrt
from typing import Tuple


R = 6373.0

def geo_distance(a: Tuple[float, float], b: Tuple[float, float]):
  lat1, lon1, lat2, lon2 = map(radians, [*a, *b])

  dlon = lon2 - lon1
  dlat = lat2 - lat1

  # Haversine formula
  a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
  c = 2 * atan2(sqrt(a), sqrt(1 - a))

  return R * c


def geo_displace(latitude: float, longitude: float, distance: float, angle: float):
  lat1 = radians(latitude)
  lon1 = radians(longitude)

  lat2 = asin(sin(lat1)*cos(distance/R) + cos(lat1)*sin(distance/R)*cos(angle))
  lon2 = lon1 + atan2(sin(angle)*sin(distance/R)*cos(lat2), cos(distance/R)-sin(lat1)*sin(lat2))

  return degrees(lat2), degrees(lon2)


class SiteStatus(enum.Enum):
  ACTIVE = 'active'
  CONFIRMED = 'confirmed'
  IN_CONVERSATION = 'in-conversation'


@dataclass(frozen=True, order=True)
class Site:
  name: str
  latitude: float
  longitude: float
  status: SiteStatus
  address: str

  @staticmethod
  def new_site(name: str, latitude: Any, longitude: Any, status: str, address: str):
    return Site(name, float(latitude), float(longitude), SiteStatus(status), address)


class Stationary:

  id_counter = 0

  def __init__(self, site: Site, latitude: float, longitude: float, start: datetime, end: datetime, step: timedelta):
    self.site = site
    self.latitude = latitude
    self.longitude = longitude
    self.start = start
    self.end = end
    self.step = step
    self.id = Stationary.id_counter
    Stationary.id_counter += 1

  def generate(self) -> List[Dict[Any, Any]]:
    data = []
    curr = self.start
    distance = 1000 * geo_distance((self.site.latitude, self.site.longitude), (self.latitude, self.longitude))
    while curr < self.end:
      datum = {}
      datum['latitude'] = self.latitude
      datum['longitude'] = self.longitude
      datum['timestamp'] = curr
      # depends on number of devices connected to the site currently
      datum['upload_speed'] = None
      # depends on number of devices connected to the site currently
      datum['download_speed'] = None
      # random - range depends on upload/download speed
      datum['data_since_last_report'] = None
      # datum.signal_strength = min(5, 5 * 50 / distance)
      datum['ping'] = distance * 1000 / 343
      data.append(datum)
      curr = curr + self.step

    return data


def compare_time(a, b):
  if a['timestamp'] > b['timestamp']:
    return 1
  elif a['timestamp'] < b['timestamp']:
    return -1
  else:
    return 0


def get_timestamp(a):
  return a['timestamp']


DEVICES_PER_SITE = 500
STEP = timedelta(hours=1)
DEVICE_MU = 20
DEVICE_SIGMA = 20
START_DATE = datetime(year=2021, month=1, day=1, hour=0, minute=0, second=0, tzinfo=timezone.utc)
END_DATE = datetime(year=2021, month=7, day=1, hour=0, minute=0, second=0, tzinfo=timezone.utc)
TIME_RANGE = END_DATE - START_DATE
HOUR = timedelta(hours=1)
DOWN_SPEED = 1000 * 1000 * 1000
UP_SPEED = 200 * 1000 * 1000


def main():
  sites: List[Site] = []
  with open('./sites.csv') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    colnames = []
    for i, row in enumerate(reader):
      if i == 0:
        colnames = row
      else:
        sites.append(Site.new_site(*row))
  
  measurements = []
  for site in sites:
    if site.status == SiteStatus.IN_CONVERSATION: continue

    _measurements: List[Dict[Any, Any]] = []
    print(site)
    for _ in range(DEVICES_PER_SITE):
      print(f'   {_}')
      distance = abs(random.normalvariate(50, 20))
      angle = random.uniform(0, 360)

      latitude, longitude = geo_displace(site.latitude, site.longitude, distance, angle)

      time1 = START_DATE + timedelta(seconds=random.uniform(0, TIME_RANGE.total_seconds()))
      time2 = START_DATE + timedelta(seconds=random.uniform(0, TIME_RANGE.total_seconds()))
      if time1 > time2:
        time1, time2 = time2, time1
      stationary = Stationary(site, latitude, longitude, time1, time2, STEP)
      _measurements.extend(stationary.generate())
    
    _measurements = sorted(_measurements, key=get_timestamp)
    curr = START_DATE + HOUR

    prev_i = 0
    curr_i = 0
    print(len(_measurements))
    while prev_i < len(_measurements):
      while curr_i < len(_measurements) and _measurements[curr_i]['timestamp'] < curr:
        curr_i += 1

      _slice = _measurements[prev_i:curr_i]
      for datum in _slice:
        datum['download_speed'] = DOWN_SPEED / len(_slice)
        datum['upload_speed'] = UP_SPEED / len(_slice)
        total_speed = datum['download_speed'] + datum['upload_speed']
        datum['data_since_last_report'] = total_speed * random.uniform(0, 1 * 60 * 60)

      curr += HOUR
      prev_i = curr_i

    measurements.extend(_measurements)
  
  for measurement in measurements:
    measurement['timestamp'] = measurement['timestamp'].isoformat()
  
  with open('./data-small.json', 'w') as output:
    output.write(json.dumps(measurements[0:10000], indent=2))

  with open('./data.json', 'w') as output:
    output.write(json.dumps(measurements, indent=2))


if __name__ == '__main__':
  main()