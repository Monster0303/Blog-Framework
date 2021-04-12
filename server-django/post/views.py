from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse, HttpResponseBadRequest
from user.views import authenticate
import simplejson, datetime, math
from post.models import Post, Content


# Create your views here.

@authenticate
def pub(request: HttpRequest):
    try:
        request_pub = simplejson.loads(request.body)
        title = request_pub['title']

        post = Post()
        post.title = title
        post.author = request.user
        post.pub_time = datetime.datetime.now(tz=datetime.timezone(datetime.timedelta(hours=8)))
        post.save()  # save 时会提交事务，并立刻查询一次缓存在 post 实例中。又因为 id 字段是自增的，所以这时就获取到了 id 字段

        content = Content()

        content.post = post  # 因为 content.post 字段是 OneToOne 类型，所以会自动映射到 post 实例的主键 id 字段
        content.content = request_pub['content']
        content.save()

        return JsonResponse({'post_id': post.id})
    except:
        return HttpResponseBadRequest()


def get(request: HttpRequest, post_id):  # 捕获传入的正则分组
    try:
        post = Post.objects.get(pk=int(post_id))  # get 方法保证必须只有一条记录，否则抛异常
        return JsonResponse({
            'post': {
                'author_id': post.author_id,
                'post_id': post.id,
                'title': post.title,
                'pub_time': int(post.pub_time.timestamp()),
                'content': post.content.content
            }
        })
    except:
        return HttpResponseBadRequest(status=404)


def validate(d: dict, name: str, conv_func, default, val_func=lambda x, y: x if x > 0 else y):
    """验证分页参数的合法性"""
    try:
        ret = d.get(name)
        ret = conv_func(ret)
        ret = val_func(ret, default)
    except Exception as e:
        print(e)
        ret = default
    return ret


def getall(request: HttpRequest):
    try:
        # 页码
        page = validate(request.GET, 'page', int, 1, lambda x, y: x if x > 0 else y)
        # 每页显示多少行。   注意，这个数据不要轻易让浏览器端改变，如果允许改变，一定要控制范围
        size = validate(request.GET, 'size', int, 3, lambda x, y: x if 0 < x < 100 else y)

        start = (page - 1) * size

        qs = Post.objects
        count = qs.count()
        # 按照 id 倒排
        posts = qs.order_by('-id')[start: start + size]  # offset start, limit size

        return JsonResponse({
            'posts': [{

                'post_id': post.id,
                'author': post.author_id,
                'pub_time': int(post.pub_time.timestamp()),
                'title': post.title
            } for post in posts],
            'pagination': {
                'page': page,
                'size': size,
                'pages_count': math.ceil(count / size),
                'posts_count': count
            }
        })

    except Exception as e:
        print(e)
        return HttpResponseBadRequest()
