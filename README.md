# Product Inventory API

This API is designed to manage a **Product Inventory System** with support for both **MongoDB** and **PostgreSQL** databases. The API provides authentication, authorization, and full CRUD operations for products.

## Features
- **Dual Database Support**: Works with both **MongoDB** and **PostgreSQL**.
- **JWT Authentication**: Secure access using JSON Web Tokens.
- **Role-Based Authorization**: Admin users can create, update, and delete products.
- **Data Validation**: Express Validator is used to validate inputs.
- **Pagination & Filtering**: Fetch products with filters and pagination.

## Setup Instructions

### 1. Clone the Repository
```sh
$ git clone <your-repo-url>
$ cd backend-test
```

### 2. Install Dependencies
```sh
$ npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
DB_TYPE=mongodb  # or postgres
DB_URI=mongodb://localhost:27017/products_db # for MongoDB
DB_HOST=localhost # for PostgreSQL
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=products_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

### 4. Start the Server
```sh
$ npm run dev
```

---
## API Endpoints

### Authentication
- **POST /auth/login** – Authenticate a user and receive a JWT token.

### Product Management (Requires Admin Role)
- **POST /products** – Create a new product.
- **PUT /products/:id** – Update an existing product.
- **DELETE /products/:id** – Delete a product.

### Public Product Endpoints
- **GET /products** – Fetch all products with pagination.
- **GET /products/:id** – Fetch a product by its ID.
- **GET /products/category/:categoryName** – Fetch products by category.

#### Example: Fetch products by category
```sh
GET /products/category/electronics
```

#### Example: Fetch paginated products
```sh
GET /products?page=1&limit=10
```

---
## Database Support
The API supports both **MongoDB** and **PostgreSQL**.
- If `DB_TYPE=mongodb`, the API uses **Mongoose** models.
- If `DB_TYPE=postgres`, the API uses **TypeORM** repositories.

### MongoDB Query Example:
```js
ProductModel.find({ category: "Electronics" }).sort({ price: 1 }).limit(10);
```

### PostgreSQL Query Example:
```sql
SELECT * FROM products WHERE category = 'Electronics' ORDER BY price ASC LIMIT 10;
```



### Questions?
Feel free to reach out for any clarifications.


