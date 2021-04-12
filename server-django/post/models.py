from django.db import models
from user.models import User


# Create your models here.

class Post(models.Model):
    class Meta:
        db_table = 'post'

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=256, null=False)
    pub_time = models.DateTimeField(null=False)
    # 从 post 查作者，从 post 查内容
    author = models.ForeignKey(User, on_delete=models.CASCADE)  # 指定外键，migrate 会生成 author_id 字段

    def __repr__(self):
        return f'<Post: {self.id} {self.title} {self.author.email} {self.pub_time} {self.content}>'
        # 因为在 Content 表中创建了一对一字段，这里就隐式的把 content 映射到 content 字段。
        # 所以当 self.content 时，就是以字符串显示，会调用 Content 中的 __repr__ 方法。

    __str__ = __repr__


class Content(models.Model):
    class Meta:
        db_table = 'content'

    # 如果没有主键，会自动创建一个自增主键
    post = models.OneToOneField(Post, on_delete=models.CASCADE)    # 一对一，这边会用一个外键引用 post 表的主键
    content = models.TextField(null=False)

    def __repr__(self):
        return f'<Content: {self.post.id} {self.content[:6]}>'

    __str__ = __repr__
