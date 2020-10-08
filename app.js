// generic imports
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");

// app - express
const app = express();

// modern connection
const db = async () => {
    try {
        const success = await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true, 
            useFindAndModify: false
        });
        console.log('DB Connected');
    } catch (error) {
        console.log('DB Connection Error', error);
    }
}

// execute db connection
db();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: "1.0.0",
            title: "Ecommerce API",
            description: "Ecommerce API Information",
            contact: {
                name: "miguel_dev"
            },
            servers: ["http://localhost:8001"]
        }
    },
    // definition the apis with swagger 
    apis: ['./routes/*.js']
};

// final definitions with swagger-express
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/* routes middlewares */
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

// port
const port = process.env.PORT || 8000;

// listen port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



