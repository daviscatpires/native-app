import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBpHYrj8LHB3PiRLKaid_fRmtMbeP1ubuk';

const App = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    // Fetch nearby places
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-23.55052,-46.633308&radius=1500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`
        );
        setPlaces(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaces();
  }, []);

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
      );
      setSelectedPlace(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPlace = ({ item }) => (
    <TouchableOpacity onPress={() => fetchPlaceDetails(item.place_id)} style={styles.placeItem}>
      <Text style={styles.placeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.place_id}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
            onPress={() => fetchPlaceDetails(place.place_id)}
          />
        ))}
      </MapView>
      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={(item) => item.place_id}
        style={styles.list}
      />
      {selectedPlace && (
        <View style={styles.details}>
          <Text style={styles.placeDetailsName}>{selectedPlace.name}</Text>
          <Text>{selectedPlace.formatted_address}</Text>
          <Text>{selectedPlace.formatted_phone_number}</Text>
          <Text>{selectedPlace.website}</Text>
          <Text style={styles.productsTitle}>Products and Prices:</Text>
          <Text>Burger: $10</Text>
          <Text>Pizza: $15</Text>
          <Text>Soda: $3</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  list: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    maxHeight: Dimensions.get('window').height / 2,
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  placeName: {
    fontSize: 16,
  },
  details: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
  },
  placeDetailsName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productsTitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default App;
