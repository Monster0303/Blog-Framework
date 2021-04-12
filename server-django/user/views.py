from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseBadRequest
from blog.settings import SECRET_KEY
from .models import User
import jwt, bcrypt, simplejson, datetime, logging, time

# Create your views here.

FORMAT = '%(asctime)s %(thread)d %(threadName)s %(message)s'
logging.basicConfig(level=logging.INFO, format=FORMAT, datefmt='%Y-%m-%d-%H:%M:%S')  # root 级

AUTH_EXPIRE_INTERVAL = 60 * 60 * 6  # 6H


def gen_token(user_id):
    """生成 token"""
    payload = {
        'user_id': user_id,
        'exp': int(datetime.datetime.now().timestamp() + AUTH_EXPIRE_INTERVAL)  # 增加时间戳
        # 在 jwt 的 payload 中增加 exp，要使用整数。当使用 jwt 进行验证时会判断是否过期
    }
    return jwt.encode(payload, SECRET_KEY, 'HS256').decode()  # 字符串


def reg(request: HttpRequest):
    try:
        # 有任何异常，都返回400，如果保存数据出错，则向外抛出异常
        request_reg = simplejson.loads(request.body)
        email = request_reg['email']
        query = User.objects.filter(email=email)
        if query:
            return HttpResponseBadRequest()  # 这里返回实例，这不是异常类

        name = request_reg['name']
        passwd = bcrypt.hashpw(request_reg['passwd'].encode(), bcrypt.gensalt())
        logging.info(f'reg_info: {email}, {name}, {passwd}')

        user = User()
        user.email = email
        user.name = name
        user.passwd = passwd.decode()
        user.save()

        return JsonResponse({
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
            },
            'token': gen_token(user.id)
        })  # 如果正常，返回json数据
    except Exception as e:
        logging.warning(f'reg_error: {e}')
        return HttpResponseBadRequest()


def login(request: HttpRequest):
    try:
        request_login = simplejson.loads(request.body)
        email = request_login['email']
        passwd = request_login['passwd']

        # 验证邮箱是否存在，存在之后，再验证密码
        user = User.objects.filter(email=email).first()
        if not user:  # 查无此人
            return HttpResponseBadRequest()
        if not bcrypt.checkpw(passwd.encode(), user.passwd.encode()):  # 如果密码验证不通过
            return HttpResponseBadRequest()

        return JsonResponse({
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
            },
            'token': gen_token(user.id)
        })  # 状态码 200

    except Exception as e:
        logging.warning(f'reg_error: {e}')
        return HttpResponseBadRequest()


def authenticate(view):
    """验证身份，等于拦截器"""
    def wrapper(request: HttpRequest, *args):
        try:
            token = request.META['HTTP_JWT']  # 会被加前缀HTTP_且全大写
            payload = jwt.decode(token, SECRET_KEY)  # 解码，同时验证过期时间

            user_id = payload['user_id']
            user = User.objects.get(pk=user_id)
            request.user = user  # 如果正确，则注入user

        except Exception as e:
            logging.warning(f'reg_error: {e}')
            return HttpResponse(status=401)

        return view(request, *args)

    return wrapper
