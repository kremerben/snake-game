from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.db.models import Avg
import json

# Create your views here.
from snakes.forms import UserForm
from snakes.models import Score


def home(request):
    match_leader = Score.objects.filter(game="memory").order_by('score')[:10]
    snake_leader = Score.objects.filter(game="snake").order_by('-score')[:10]
    data = {'match_leader': match_leader,
            'snake_leader': snake_leader}
    return render(request, "home.html", data)

def snakes_game(request):
    data = {
        "user": request.user
    }
    return render(request, "snakes.html", data)

def match_game(request):
    data = {
        "user": request.user
    }
    return render(request, "match.html", data)

@csrf_exempt
def update_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Score.objects.create(
            user = request.user,
            score = data['score'],
            game = data['game'],
            mode = data['mode']
        )
        print data
        return HttpResponse("It's cool man!")


"""
USER PROFILES
"""

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            return redirect("profile")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {
        'form': form,
    })


@login_required
def profile(request):
    scores = Score.objects.filter(user__username=request.user)
    match_leader = Score.objects.filter(game="memory", user__username=request.user).order_by('score')[:10]
    match_avg = Score.objects.filter(game="memory", user__username=request.user).aggregate(Avg('score'))
    snake_leader = Score.objects.filter(game="snake", user__username=request.user).order_by('-score')[:10]
    snake_avg = Score.objects.filter(game="snake", user__username=request.user).aggregate(Avg('score'))

    print match_leader
    print scores
    if request.method == "POST":
        form = UserForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect("profile")
    else:
        form = UserForm(instance=request.user)
    data = {"user": request.user,
            "form": form,
            "scores": scores,
            'match_leader': match_leader,
            'snake_leader': snake_leader,
            'match_avg': match_avg,
            'snake_avg': snake_avg}
    return render(request, "profile.html", data)


@login_required
def profile_update(request, user_id):
    user = User.objects.get(id=user_id)
    if request.method == "POST":
        form = UserForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            return redirect("profile")
    else:
        form = UserForm(instance=user)
    data = {"user": request.user, "form": form}
    return render(request, "profile/profile_update.html", data)
