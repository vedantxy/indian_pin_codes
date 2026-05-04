# API Documentation - All India Pincode

This document describes all the backend REST API endpoints available in the application. The base URL for all endpoints is `/api`.

## 1. Search Endpoints

### 1.1 Global Search
- **Endpoint:** `GET /api/search`
- **Description:** Performs a full-text search across Pincodes, Office Names, Districts, and States.
- **Query Parameters:**
  - `q` (string, required): The search keyword (min 2 characters).
- **Response Format:**
  ```json
  [
    {
      "officeName": "Andheri",
      "pincode": "400053",
      "district": "Mumbai",
      "state": "MAHARASHTRA",
      "taluk": "Mumbai",
      "deliveryStatus": "Delivery"
    }
  ]
  ```

### 1.2 Pincode Specific Details
- **Endpoint:** `GET /api/search/:pincode`
- **Description:** Returns the details of a specific 6-digit Pincode.
- **URL Parameters:**
  - `pincode` (string, required): The exact 6-digit pincode.
- **Response Format:** Array of matching offices exactly like the global search response.

---

## 2. Directory & Filtering Endpoints

### 2.1 Get Filtered Pincodes (Paginated)
- **Endpoint:** `GET /api/pincodes`
- **Description:** Retrieves paginated pincode data. Allows filtering by state, district, and taluk.
- **Query Parameters:**
  - `page` (number, default: 1): The page number.
  - `limit` (number, default: 20): Items per page.
  - `state` (string, optional): Exact state name filter.
  - `district` (string, optional): Exact district name filter.
- **Response Format:**
  ```json
  {
    "data": [
      {
        "officeName": "...",
        "pincode": "...",
        "district": "...",
        "state": "...",
        "taluk": "...",
        "deliveryStatus": "..."
      }
    ],
    "total": 19300,
    "page": 1,
    "limit": 20
  }
  ```

### 2.2 Get All States
- **Endpoint:** `GET /api/states`
- **Description:** Retrieves a unique list of all states available in the database.
- **Response Format:**
  ```json
  ["ANDAMAN & NICOBAR ISLANDS", "ANDHRA PRADESH", "MAHARASHTRA", "..."]
  ```

---

## 3. Analytics & Statistics Endpoints

### 3.1 General Stats
- **Endpoint:** `GET /api/stats`
- **Description:** Returns high-level metrics for the entire database.
- **Response Format:**
  ```json
  {
    "totalPincodes": 154000,
    "totalStates": 36,
    "deliveryOffices": 140000,
    "nonDeliveryOffices": 14000
  }
  ```

### 3.2 State Distribution
- **Endpoint:** `GET /api/stats/state-distribution`
- **Description:** Returns the top states ordered by the number of post offices.
- **Response Format:**
  ```json
  [
    {
      "state": "UTTAR PRADESH",
      "count": 17650
    },
    {
      "state": "MAHARASHTRA",
      "count": 12500
    }
  ]
  ```

### 3.3 Delivery vs Non-Delivery
- **Endpoint:** `GET /api/stats/delivery-distribution`
- **Description:** Returns the breakdown of post offices by delivery status.
- **Response Format:**
  ```json
  {
    "delivery": 140000,
    "nonDelivery": 14000
  }
  ```

---

## 4. Export Endpoints

### 4.1 Export to CSV
- **Endpoint:** `GET /api/export`
- **Description:** Generates and triggers a download of a CSV file containing the pincode data.
- **Query Parameters:**
  - `state` (string, optional): Filter export by state.
  - `district` (string, optional): Filter export by district.
- **Response:**
  - `Content-Type: text/csv` (Triggers browser download)
