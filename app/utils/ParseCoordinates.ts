export const parseCoordinates = function (area) {
  return area.map((coordinate) => {
    return {
      latitude: coordinate[1],
      longitude: coordinate[0]
    }
  })
}

export const parseCoordinatesForGoogle = function (area) {
  return area.map((coordinate) => {
    return {
      lat: coordinate[1],
      lng: coordinate[0]
    }
  })
}
