import { gql } from "@apollo/client";
export const LISTINGS_QUERY = gql`
  query Listings(
    $limit: Int!
    $page: Int!
    $search: String
  ) {
    listings(
      limit: $limit
      page: $page
      search: $search
    ) {
      items {
        id
        title
        location
        address
        category
        description
        images
        rating
        reviewsCount
        guests
        bedrooms
        beds
        bathrooms
        amenities
        pricePerNight
        isFavorite
      }

      pagination {
        total
        totalPages
      }
    }
  }
`;

export const LISTING_DETAIL_QUERY = gql`
  query Listing($listingId: ID!) {
    listing(id: $listingId) {
      id
      title
      location
      address
      category
      description
      images
      rating
      reviewsCount
      guests
      bedrooms
      beds
      bathrooms
      amenities
      pricePerNight
      isFavorite
    }
  }
`;

export const ADD_FAVORITE_MUTATION = gql`
  mutation AddFavorite(
    $listingId: ID!
  ) {
    addFavorite(
      listingId: $listingId
    ) {
      id
      isFavorite
    }
  }
`;

export const REMOVE_FAVORITE_MUTATION = gql`
  mutation RemoveFavorite(
    $listingId: ID!
  ) {
    removeFavorite(
      listingId: $listingId
    ) {
      id
      isFavorite
    }
  }
`;

export const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking(
    $listingId: ID!
    $checkIn: String!
    $checkOut: String!
    $guests: Int!
  ) {
    createBooking(
      listingId: $listingId
      checkIn: $checkIn
      checkOut: $checkOut
      guests: $guests
    ) {
      id
    }
  }
`;

export const CREATE_LISTING_MUTATION = gql`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
      description
      category
      pricePerNight
      location
      address
      guests
      bedrooms
      beds
      bathrooms
      amenities
      images
      isFavorite
      isFeatured
      rating
      reviewsCount
      createdAt
    }
  }
`;



export const FAVORITES_QUERY = gql`
  query Favorites {
    favorites {
      id
      title
      location
      images
      rating
      pricePerNight
      isFavorite
    }
  }
`;

export const BOOKINGS_QUERY = gql`
  query Bookings {
    bookings {
      id
      checkIn
      checkOut
      guests
      totalPrice
      status

      listing {
        id
        title
        location
        images
      }
    }
  }
`;


export const CANCEL_BOOKING_MUTATION = gql`
  mutation CancelBooking(
    $bookingId: ID!
  ) {
    cancelBooking(
      bookingId: $bookingId
    ) {
      id
      status
    }
  }
`;


export const LOGIN_MUTATION = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        createdAt
        email
        id
        name
      }
      accessToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      accessToken
      user {
        id
        name
        email
      }
    }
  }
`;
