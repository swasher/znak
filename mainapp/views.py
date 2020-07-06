from django.shortcuts import render
import sys
from django.http import JsonResponse
from django.http import FileResponse


def json(request):
    p = sys.platform
    return JsonResponse({'platform': p})


def index(request):
    vuejs_html = '/app/dist/index.html'
    return FileResponse(open(vuejs_html, 'r'))
