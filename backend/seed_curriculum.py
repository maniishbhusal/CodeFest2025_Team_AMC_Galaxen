"""
Seed script to create sample curriculum data for testing.
Run with: python manage.py shell < seed_curriculum.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autisahara.settings')
django.setup()

from therapy.models import Curriculum, CurriculumTask
from accounts.models import User, Doctor

# Get or create a doctor to be the creator
doctor_user = User.objects.filter(role='doctor').first()
if doctor_user:
    doctor, _ = Doctor.objects.get_or_create(
        user=doctor_user,
        defaults={'license_number': 'NMC-12345', 'specialization': 'Child Psychiatry', 'is_approved': True}
    )

    # Create 15-day General Curriculum
    curriculum1, created1 = Curriculum.objects.get_or_create(
        title='15-Day Introductory Program',
        defaults={
            'description': 'A gentle introduction to therapy tasks designed for children beginning their developmental journey. Focuses on basic communication, social interaction, and motor skills.',
            'duration_days': 15,
            'type': 'general',
            'created_by': doctor,
        }
    )

    # Create 30-day Specialized Curriculum
    curriculum2, created2 = Curriculum.objects.get_or_create(
        title='30-Day Communication Focus',
        defaults={
            'description': 'Specialized curriculum focusing on speech and communication skills development. Includes activities for verbal and non-verbal communication improvement.',
            'duration_days': 30,
            'type': 'specialized',
            'spectrum_type': 'mild',
            'created_by': doctor,
        }
    )

    # Create 45-day Comprehensive Curriculum
    curriculum3, created3 = Curriculum.objects.get_or_create(
        title='45-Day Comprehensive Development',
        defaults={
            'description': 'Complete developmental program covering social skills, communication, sensory processing, and daily living activities.',
            'duration_days': 45,
            'type': 'specialized',
            'spectrum_type': 'moderate',
            'created_by': doctor,
        }
    )

    print(f'Created curricula: {curriculum1.title} (new={created1}), {curriculum2.title} (new={created2}), {curriculum3.title} (new={created3})')

    # Add tasks to the 15-day curriculum
    tasks_data = [
        # Day 1
        {'day': 1, 'title': 'Eye Contact Practice', 'why': 'Eye contact is fundamental for social connection and communication development.', 'instructions': '1. Sit at child\'s eye level\n2. Hold a favorite toy near your eyes\n3. When child looks, smile and say their name\n4. Repeat 5-10 times throughout the day'},
        {'day': 1, 'title': 'Name Response', 'why': 'Responding to name is crucial for attention and safety.', 'instructions': '1. Call child\'s name from different distances\n2. Wait 3 seconds for response\n3. If no response, gently guide their attention\n4. Praise any response attempt'},
        # Day 2
        {'day': 2, 'title': 'Joint Attention - Pointing', 'why': 'Joint attention is the foundation for shared experiences and learning.', 'instructions': '1. Point to interesting objects around the room\n2. Say "Look!" enthusiastically\n3. Wait for child to follow your point\n4. Celebrate when they look at the object'},
        {'day': 2, 'title': 'Simple Imitation', 'why': 'Imitation skills are essential for learning new behaviors.', 'instructions': '1. Start with simple actions: clap hands, wave\n2. Do the action and say "Do this!"\n3. Help child physically if needed\n4. Praise all attempts'},
        # Day 3
        {'day': 3, 'title': 'Turn Taking with Toys', 'why': 'Turn taking builds patience and social reciprocity.', 'instructions': '1. Roll a ball back and forth\n2. Say "My turn" then "Your turn"\n3. Keep turns short (5-10 seconds)\n4. Use a timer for visual support'},
        {'day': 3, 'title': 'Following Simple Commands', 'why': 'Following instructions is important for learning and safety.', 'instructions': '1. Give one-step commands: "Sit down", "Come here"\n2. Use gestures along with words\n3. Give 5 seconds to respond\n4. Help physically if needed, then praise'},
        # Day 4
        {'day': 4, 'title': 'Requesting Practice', 'why': 'Teaching requesting reduces frustration and builds communication.', 'instructions': '1. Hold a favorite item just out of reach\n2. Wait for any communication attempt\n3. Accept pointing, reaching, or sounds\n4. Give item immediately when they request'},
        # Day 5
        {'day': 5, 'title': 'Sensory Play', 'why': 'Sensory activities support regulation and exploration.', 'instructions': '1. Set up playdough or kinetic sand\n2. Let child explore at their own pace\n3. Model simple actions: roll, poke, flatten\n4. Describe what you\'re doing'},
        # Day 6
        {'day': 6, 'title': 'Social Smile Practice', 'why': 'Social smiling strengthens bonds and communication.', 'instructions': '1. Make funny faces to encourage smiles\n2. Respond warmly to any smiles\n3. Play peek-a-boo games\n4. Take photos of happy moments'},
        # Day 7
        {'day': 7, 'title': 'Book Reading Together', 'why': 'Shared book reading builds language and attention.', 'instructions': '1. Choose books with bright pictures\n2. Point to and name pictures\n3. Let child turn pages\n4. Keep sessions short (2-5 minutes)'},
        # Day 8
        {'day': 8, 'title': 'Music and Movement', 'why': 'Music supports language development and motor skills.', 'instructions': '1. Play favorite songs\n2. Do simple movements together\n3. Pause and wait for child to request more\n4. Use instruments like drums or shakers'},
        # Day 9
        {'day': 9, 'title': 'Outdoor Exploration', 'why': 'Nature provides rich sensory and learning experiences.', 'instructions': '1. Take a short walk outside\n2. Point out birds, trees, flowers\n3. Let child touch safe natural items\n4. Describe what you see and hear'},
        # Day 10
        {'day': 10, 'title': 'Pretend Play Introduction', 'why': 'Pretend play develops imagination and social skills.', 'instructions': '1. Use toy cups and plates\n2. Pretend to drink and eat\n3. Offer pretend food to child\n4. Keep play simple and repetitive'},
        # Day 11
        {'day': 11, 'title': 'Choice Making', 'why': 'Making choices builds autonomy and decision-making.', 'instructions': '1. Offer two clear choices\n2. Hold items up for child to see\n3. Wait for pointing or reaching\n4. Honor their choice immediately'},
        # Day 12
        {'day': 12, 'title': 'Emotion Recognition', 'why': 'Understanding emotions helps with social development.', 'instructions': '1. Use picture cards of faces\n2. Name emotions: happy, sad, angry\n3. Make the faces yourself\n4. Point out emotions in real life'},
        # Day 13
        {'day': 13, 'title': 'Gross Motor Play', 'why': 'Physical activity supports overall development.', 'instructions': '1. Play with balls - rolling, throwing\n2. Practice jumping or hopping\n3. Set up simple obstacle course\n4. Celebrate all attempts'},
        # Day 14
        {'day': 14, 'title': 'Fine Motor Activities', 'why': 'Fine motor skills are essential for daily tasks.', 'instructions': '1. Practice stacking blocks\n2. Do simple puzzles together\n3. Practice picking up small items\n4. Use pincer grasp activities'},
        # Day 15
        {'day': 15, 'title': 'Review and Celebration', 'why': 'Celebrating progress motivates continued effort.', 'instructions': '1. Review favorite activities from the program\n2. Notice improvements in skills\n3. Take progress photos/videos\n4. Plan for continued practice'},
    ]

    created_count = 0
    for i, task_data in enumerate(tasks_data):
        task, created = CurriculumTask.objects.get_or_create(
            curriculum=curriculum1,
            day_number=task_data['day'],
            title=task_data['title'],
            defaults={
                'why_description': task_data['why'],
                'instructions': task_data['instructions'],
                'order_index': i + 1,
            }
        )
        if created:
            created_count += 1

    print(f'Created {created_count} new tasks for 15-day curriculum (total tasks: {len(tasks_data)})')
    print('Sample curriculum data created successfully!')
else:
    print('No doctor user found. Please create a doctor account first.')
