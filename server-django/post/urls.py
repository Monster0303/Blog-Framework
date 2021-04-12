from django.conf.urls import url
from .views import pub, get, getall

urlpatterns = [
    url(r'^pub$', pub),
    url(r'^(\d+)$', get),    # 会把匹配到的分组数据，传给 get，是 str 类型
    url(r'^getall', getall),
]
