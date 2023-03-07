from datetime import datetime

from db import db
from flask import jsonify
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models import OrderModel, OrderProductModel
from schema.schemas import OrderProductSchema, OrderSchema, OrderTSchema
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

blp = Blueprint("Orders", __name__, description="Operations on Orders")


@blp.route("/order/<string:order_id>")
class Order(MethodView):
    @blp.response(200, OrderTSchema)
    def get(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        return order.toDict()

    def delete(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()

        return {"message": "Order Deleted!"}
    

@blp.route("/order")
class OrderCreate(MethodView):
    @blp.arguments(OrderProductSchema)
    @blp.response(201, OrderSchema)
    def post(self, order_data):
        date = datetime.utcnow()
        deliver = order_data["deliver"]
        dict = {
            "id_user": order_data["id_user"],
            "date": date
        }
        order = OrderModel(**dict)
        db.session.add(order)
        db.session.commit()
        for item in order_data["order"]:
            dicts = {
                "amount": item["amount"],
                "total": (item["amount"]*item["price"]) + deliver,
                "id_product":item["id"],
                "id_order": order.id
            }
            orderItem = OrderProductModel(**dicts)
            db.session.add(orderItem)
            db.session.commit()
        # try:
        #     db.session.add(order)
        #     db.session.commit()
        # except IntegrityError:
        #     abort(400, message="A order with that name already exists")
        # except SQLAlchemyError:
        #     abort(500, message="An error occurred while inserting the item")

        return order


@blp.route("/orders")
class OrderList(MethodView):
    @blp.response(200, OrderProductSchema(many=True))
    def get(self):
        items = OrderProductModel.query.all()
        itemsArr = []
        for contact in items:
            itemsArr.append(contact.toDict()) 
        return jsonify(itemsArr)


# @blp.route("/orders/<string:id_user>")
# class OrderUserList(MethodView):
#     @blp.response(200, OrderSchema(many=True))
#     def get(self, id_user):
#         orders = OrderModel.query.filter(OrderModel.id_user == id_user).all()
#         itemsArr = []
#         for order in orders:
#             id_ = order.id
#             items = OrderProductModel.query.filter(OrderProductModel.id_order == id_).all()
#             itemsArr.append({"date":order.date}) 
#             for contact in items:
#                 itemsArr.append(contact.toDict()) 
#         return jsonify(itemsArr)
    
@blp.route("/orders/<string:id_user>")
class OrderUserList(MethodView):
    @blp.response(200, OrderSchema(many=True))
    def get(self, id_user):
        l_orders = []
        sql = text("SELECT id_order, name, amount, total, date, image, price \
            FROM orders_products AS op \
            INNER JOIN orders AS o \
            ON op.id_order=o.id \
            INNER JOIN products AS p \
			ON op.id_product=p.id \
            WHERE o.id_user = :id_")
        result = db.session.execute(sql,{'id_': id_user})
        for r in result:
            order = {
                "id_order": r[0],
                "product": r[1],
                "amount": r[2],
                "total": r[3],
                "date": r[4],
                "image": r[5],
                "price": r[6]
            } 
            l_orders.append(order)
        return jsonify(l_orders)