FROM python:3
WORKDIR /blog/
COPY blog/ ./blog/
COPY post/ ./post/
COPY user/ ./user/
COPY templates/ ./templates/
COPY *.py ./
COPY blog.ini ./
COPY requirements ./requirements
RUN sed -i -e 's/DEBUG.*/DEBUG = False/' -e 's/ALLOWED_HOSTS.*/ALLOWED_HOSTS = ["*"]/' -e "s/'HOST':.*/'HOST': '192.168.50.30',/" blog/settings.py

RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r /blog/requirements
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple uwsgi
CMD [ "uwsgi", "./blog.ini" ]
