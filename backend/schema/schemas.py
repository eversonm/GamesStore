from marshmallow import Schema, fields


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)

class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    score = fields.Int(required=True)
    image = fields.Str(required=True)

class OrderTSchema(Schema):
    id = fields.Int()
    date = fields.DateTime(required=True)
    id_user = fields.Int(required=True)
   
class OrderSchema(Schema):
    id = fields.Int()
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    score = fields.Int(required=True)
    amount = fields.Int(required=True)


class OrderProductSchema(Schema):
    id = fields.Int(dump_only=True)
    order = fields.List(fields.Nested(OrderSchema()))
    id_user = fields.Int()
    deliver = fields.Int(required=True)


class ProductUpdateSchema(Schema):
    name = fields.Str()
    price = fields.Float()
    store_id = fields.Int()

