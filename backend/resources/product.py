from db import db
from flask.views import MethodView
from flask_jwt_extended import get_jwt, jwt_required
from flask_smorest import Blueprint, abort
from models import ProductModel
from schema.schemas import ProductSchema, ProductUpdateSchema
from sqlalchemy.exc import SQLAlchemyError

blp = Blueprint("Products", "products", description="Operations on Products")


@blp.route("/product/<string:product_id>")
class Product(MethodView):
    @blp.response(200, ProductSchema)
    def get(self, product_id):
        product = ProductModel.query.get_or_404(product_id)
        return product
    

    @jwt_required()
    def delete(self, product_id):
        jwt = get_jwt()
        if not jwt.get("is_admin"):
            abort(401, message="Admin privilege required.")

        product = ProductModel.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return {"message": "Product Deleted!"}

    @jwt_required()
    @blp.arguments(ProductUpdateSchema)
    @blp.response(200, ProductSchema)
    def put(self, product_data, product_id):
        product = ProductModel.query.get(product_id)
        if product:
            product.price = product_data["price"]
            product.name = product_data["name"]
        else:
            product = ProductModel(id=product_id, **product_data)

        db.session.add(product)
        db.session.commit()

        return product


@blp.route("/product")
class ProductPost(MethodView):
    @jwt_required()
    @blp.arguments(ProductSchema)
    @blp.response(201, ProductSchema)
    def post(self, product_data):
        product = ProductModel(**product_data)

        try:
            db.session.add(product)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while inserting the product")
        return product


@blp.route('/products', defaults={"filter": ""})
@blp.route("/products/<string:filter>")
class ProductList(MethodView):
    # @jwt_required(fresh=True)
    @blp.response(200, ProductSchema(many=True))
    
    def get(self, filter):
        match filter:
            case "name":
                return ProductModel.query.order_by(ProductModel.name).all()
            case "price":
                return ProductModel.query.order_by(ProductModel.price).all()
            case "score":
                return ProductModel.query.order_by(ProductModel.score).all()
            case _:
                return ProductModel.query.all()
    
    @blp.arguments(ProductSchema(many=True))
    @blp.response(201, ProductSchema(many=True))
    def post(self, product_data, filter):
        for item in product_data:
            product = ProductModel(**item)
            db.session.add(product)
            db.session.commit()
        return 201
        # try:
        #     db.session.add(product)
        #     db.session.commit()
        # except SQLAlchemyError:
        #     abort(500, message="An error occurred while inserting the product")
        # return product
