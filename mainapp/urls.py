from django.urls import path
from mainapp import views

urlpatterns = [
    # path('', views.font_list, name='font_list'),
    path('', views.index, name='index'),
    path('json/', views.json, name='json'),
    # path('hello/', views.hello, name='hello'),
]
