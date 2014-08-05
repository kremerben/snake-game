from django.contrib import admin
from models import Score
# Register your models here.


class ScoreAdmin(admin.ModelAdmin):

    list_display = ('user', 'game', 'score', 'mode', 'timestamp')
    list_filter = ('user', 'game', 'score', 'mode', 'timestamp')
    ordering = ('user', 'game', 'score', 'mode', 'timestamp')


admin.site.register(Score, ScoreAdmin)

