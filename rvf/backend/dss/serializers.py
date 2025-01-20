from rest_framework import serializers

# Models
from .models.sub_event import SubEvent
from .models.event import Event
from .models.epidemic_phase import EpidemicPhase
from .models.activity import Activity
from .models.category import Category


class SubEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubEvent
        fields =  ['id', 'name', 'order']

class EventSerializer(serializers.ModelSerializer):
    sub_events = SubEventSerializer(read_only= True, many = True)

    class Meta:
        model = Event
        fields =  ['id', 'name', 'order','sub_events' ]

class EpidemicPhaseSerializer(serializers.ModelSerializer):
    events = EventSerializer(read_only= True, many = True)

    class Meta:
        model = EpidemicPhase
        fields =  ['id', 'name', 'order', 'events']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['events'] = sorted(data['events'], key=lambda x: x['order'])
        for event in data['events']:
            event['sub_events'] = sorted(event['sub_events'], key=lambda x: x['order'])
        return data


class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields =  ['id', 'name', 'order']

class CategorySerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(read_only= True, many = True)

    class Meta:
        model = Category
        fields =  ['id', 'name', 'order', 'activities']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['activities'] = sorted(data['activities'], key=lambda x: x['order'])
        return data
    
    
class CategoryListSerializer(serializers.Serializer):
    pass