"""
Seed script for Pre-Assessment Curriculum (15-day autism screening tasks)
Run with: python seed_assessment_curriculum.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autisahara.settings')
django.setup()

from therapy.models import Curriculum, CurriculumTask

def create_assessment_curriculum():
    """Create the pre-assessment curriculum with 15 days of tasks (3 days for hackathon)"""

    # Delete existing assessment curriculum if any
    Curriculum.objects.filter(type='assessment').delete()

    # Create the assessment curriculum
    curriculum = Curriculum.objects.create(
        title="15-Day Pre-Assessment Program",
        description="A structured 15-day observation program to help identify developmental patterns. Each day includes 5 tasks across Social Engagement, Joint Attention, Communication, Play Skills, and Cognitive/Self-Help categories.",
        duration_days=15,
        type='assessment',
        spectrum_type='',
        created_by=None  # System-created
    )

    print(f"Created curriculum: {curriculum.title}")

    # Day 1 Tasks
    day1_tasks = [
        {
            "title": "Morning Face Time",
            "why_description": "This task helps observe your child's social engagement and eye contact abilities. Eye contact is one of the key indicators of social development.",
            "instructions": """1. Sit facing your child after they wake up
2. Smile and say "Good morning [Name]!"
3. Wait 5 seconds for any look
4. Repeat 3 times

**What to observe:**
- Did child look at your face (even for 1 second)?
- Did child smile back?
- Was there no response?""",
            "order_index": 1
        },
        {
            "title": "Point to Treat",
            "why_description": "This task assesses joint attention - the ability to share focus with another person. Following a point is an important developmental milestone.",
            "instructions": """1. Place favorite snack on table
2. Point clearly at snack
3. Say "Look! [snack name]"
4. Give snack when child looks

**What to observe:**
- Did child follow your point to the snack?
- Did child look at your face after seeing the snack?
- Was there no response to pointing?""",
            "order_index": 2
        },
        {
            "title": "Choice Making",
            "why_description": "This task evaluates communication skills - how your child expresses preferences and makes choices without words.",
            "instructions": """1. Hold up 2 toys (e.g., ball and car)
2. Ask "Ball or car?"
3. Wait 10 seconds
4. Give whichever child looks at or reaches for

**What to observe:**
- Did child look at chosen toy?
- Did child reach for chosen toy?
- Did child make a sound for choice?
- Was there no clear choice?""",
            "order_index": 3
        },
        {
            "title": "Car Fun",
            "why_description": "This task observes play skills and imitation abilities. Functional play with toys is an important developmental indicator.",
            "instructions": """1. Show car rolling on floor
2. Say "Vroom vroom!"
3. Roll car toward child
4. Wait to see what child does

**What to observe:**
- Did child push car back?
- Did child roll car independently?
- Did child just hold/spin wheels?
- Was there no interest?""",
            "order_index": 4
        },
        {
            "title": "In/Out Game",
            "why_description": "This task assesses cognitive understanding of spatial concepts and ability to follow simple instructions.",
            "instructions": """1. Take an empty box
2. Put toy IN box: "IN!"
3. Take toy OUT: "OUT!"
4. Encourage child to try

**What to observe:**
- Did child put toy IN when asked?
- Did child take toy OUT when asked?
- Did child imitate your action?
- Was there no participation?""",
            "order_index": 5
        }
    ]

    # Day 2 Tasks
    day2_tasks = [
        {
            "title": "Mirror Play",
            "why_description": "Mirror play helps assess self-recognition and social engagement through reflection awareness.",
            "instructions": """1. Sit with child in front of mirror
2. Point to child's reflection: "There's [Name]!"
3. Make funny faces
4. Wave at reflection

**What to observe:**
- Did child look at mirror reflection?
- Did child touch mirror?
- Did child smile at reflection?
- Was there no interest in mirror?""",
            "order_index": 1
        },
        {
            "title": "Surprise Bag",
            "why_description": "This task evaluates joint attention and anticipation - important skills for shared experiences.",
            "instructions": """1. Put interesting item in cloth bag
2. Point to bag: "Look inside!"
3. Pull out item slowly
4. Show excitement: "Wow!"

**What to observe:**
- Did child watch bag intently?
- Did child reach for item?
- Did child look at your excited face?
- Was there no interest?""",
            "order_index": 2
        },
        {
            "title": "Animal Sounds",
            "why_description": "This task assesses vocal imitation and engagement with sounds - early precursors to language development.",
            "instructions": """1. Show animal toy/picture
2. Make animal sound 3 times
3. Pause and wait
4. Praise any sound attempt

**What to observe:**
- Did child make similar sound?
- Did child look at toy when sound made?
- Was there no vocal response?""",
            "order_index": 3
        },
        {
            "title": "Block Stacking",
            "why_description": "Block play assesses fine motor skills, cause-effect understanding, and cooperative play abilities.",
            "instructions": """1. Stack 3 blocks saying "Up, up, up!"
2. Knock down with "Boom!"
3. Hand child one block
4. See if child stacks or knocks

**What to observe:**
- Did child stack block on top?
- Did child knock tower down?
- Did child just hold block?
- Did child throw/ignore block?""",
            "order_index": 4
        },
        {
            "title": "Big & Small",
            "why_description": "This task evaluates cognitive understanding of size concepts and ability to follow verbal instructions.",
            "instructions": """1. Show big spoon and small spoon
2. "Big spoon! Small spoon!"
3. Ask "Give me big spoon"
4. Help if needed

**What to observe:**
- Did child give correct spoon?
- Did child look at correct spoon?
- Did child give either spoon?
- Was there no response?""",
            "order_index": 5
        }
    ]

    # Day 3 Tasks
    day3_tasks = [
        {
            "title": "Tickle Countdown",
            "why_description": "This task assesses anticipation and social engagement through predictable, fun interactions.",
            "instructions": """1. "I'm going to tickle... 1... 2... 3... TICKLE!"
2. Tickle under arms/chin
3. Look for anticipation look during count
4. Repeat 2-3 times

**What to observe:**
- Did child look during countdown?
- Did child laugh/smile?
- Did child pull away?
- Was there no reaction?""",
            "order_index": 1
        },
        {
            "title": "Window Watching",
            "why_description": "This task evaluates joint attention in a natural setting - sharing interest in the outside world.",
            "instructions": """1. Stand by window with child
2. Point to something outside: "Look! Bird/Car!"
3. Alternate gaze between outside and child
4. Comment: "Wow! It's flying/driving!"

**What to observe:**
- Did child look where pointed?
- Did child alternate gaze with you?
- Did child show interest?
- Was there no attention to window?""",
            "order_index": 2
        },
        {
            "title": "Gesture for 'More'",
            "why_description": "Teaching and observing gesture use is key for pre-verbal communication assessment.",
            "instructions": """1. When child wants more of something
2. Tap your own fingertips together: "More?"
3. Give more immediately if child makes any attempt
4. Repeat each time child wants more

**What to observe:**
- Did child try to imitate gesture?
- Did child make sound when saw gesture?
- Was there no response to gesture?""",
            "order_index": 3
        },
        {
            "title": "Simple Puzzle",
            "why_description": "Puzzle play assesses problem-solving, fine motor skills, and ability to work toward a goal.",
            "instructions": """1. Use 2-piece shape sorter or simple puzzle
2. Show how piece fits
3. Give piece to child
4. Help hand-over-hand if needed

**What to observe:**
- Did child put piece in correctly?
- Did child try to put piece in?
- Did child just hold/chew piece?
- Did child refuse puzzle?""",
            "order_index": 4
        },
        {
            "title": "Follow Simple Command",
            "why_description": "This task assesses receptive language and ability to follow verbal instructions in daily routines.",
            "instructions": """1. During routines, give one command:
   - "Come here"
   - "Sit down"
   - "Give me"
2. Use gesture with words
3. Praise immediately if follows

**What to observe:**
- Did child follow 1 command independently?
- Did child follow with help/gesture?
- Was there no response to commands?""",
            "order_index": 5
        }
    ]

    # Create all tasks
    all_days = [
        (1, day1_tasks),
        (2, day2_tasks),
        (3, day3_tasks),
    ]

    task_count = 0
    for day_number, tasks in all_days:
        for task_data in tasks:
            CurriculumTask.objects.create(
                curriculum=curriculum,
                day_number=day_number,
                title=task_data["title"],
                why_description=task_data["why_description"],
                instructions=task_data["instructions"],
                demo_video_url="",
                order_index=task_data["order_index"]
            )
            task_count += 1
            print(f"  Created Day {day_number} Task: {task_data['title']}")

    print(f"\nTotal tasks created: {task_count}")
    print(f"Curriculum ID: {curriculum.id}")
    return curriculum

if __name__ == "__main__":
    print("=" * 50)
    print("Creating Pre-Assessment Curriculum")
    print("=" * 50)
    create_assessment_curriculum()
    print("\nDone!")
