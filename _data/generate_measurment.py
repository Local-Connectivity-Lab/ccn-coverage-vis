import csv
import enum
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Dict, List
from math import radians, sin, cos, atan2, sqrt
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
  def new_site(name: str, latitude: float, longitude: float, status: str, address: str):
    return Site(name, latitude, longitude, SiteStatus(status), address)


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
      datum.latitude = self.latitude
      datum.longitude = self.longitude
      datum.timestamp = curr
      # depends on number of devices connected to the site currently
      datum.upload_speed = None
      # depends on number of devices connected to the site currently
      datum.download_speed = None
      # random - range depends on upload/download speed
      datum.data_since_last_report = None
      # datum.signal_strength = min(5, 5 * 50 / distance)
      datum.ping = distance * 1000 / 343
      data.append(datum)
      curr = curr + self.step

    return data


def main():
  sites = []
  with open('./sites.csv') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    colnames = []
    for i, row in enumerate(reader):
      if i == 0:
        colnames = row
      else:
        sites.append(Site(*row))
  
  print(str(sites))


if __name__ == '__main__':
  main()