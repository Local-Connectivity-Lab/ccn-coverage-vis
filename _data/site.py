import enum
from dataclasses import dataclass


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