from setuptools import setup  # 内部返回了 return distutils.core.setup(**attrs)
import glob

setup(
    name="blog",
    version="0.1.1",
    author="monster",
    author_email="monster@admin.com",
    description="This is Blog project, use Django and react.",
    python_requires='>=3.8',
    packages=['blog', 'post', 'user'],  # 要打包的包。只会打包以 .py .pyc 结尾的文件(内部的目录也不会打包)，如有其他类型的文件要打包，需要在 data_files 中指定
    data_files=glob.glob('templates/*') +  # glob 会返回一个列表，包含匹配到的文件(str)
               [
                   'requirements.txt',  # 刚才生成的依赖包列表
                   'uwsgi.ini',    # uwsgi 配置文件
                   'Dockerfile',  #  docker 配置文件
                   'manage.py'  # 默认不带，因为 runserver 只是一个测试的 web 服务
               ] +
               glob.glob('post/migrations/*') + glob.glob('user/migrations/*')  # 数据库迁移目录看实际情况，如果数据库已经创建好了则不需要打包
)
