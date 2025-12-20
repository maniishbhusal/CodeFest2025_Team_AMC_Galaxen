"""
Seed script for Specialized Curricula Tasks
- 30-Day Communication Focus (mild spectrum)
- 45-Day Comprehensive Development (moderate spectrum)

Run with: python seed_specialized_curriculum.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autisahara.settings')
django.setup()

from therapy.models import Curriculum, CurriculumTask


def create_communication_focus_tasks():
    """Create tasks for 30-Day Communication Focus (mild spectrum)"""

    curriculum = Curriculum.objects.filter(title='30-Day Communication Focus').first()
    if not curriculum:
        print("30-Day Communication Focus curriculum not found!")
        return

    # Delete existing tasks
    CurriculumTask.objects.filter(curriculum=curriculum).delete()

    # Day 1 Tasks - Basic Communication
    day1_tasks = [
        {
            "title": "Requesting with Words",
            "why_description": "Using words to request items builds expressive language and reduces frustration. This is foundational for functional communication.",
            "instructions": """1. Place favorite snack/toy just out of reach
2. Wait for child to ask verbally (any word or approximation)
3. Model the word: "Say 'cookie'" or "Say 'ball'"
4. Give item immediately when child attempts the word
5. Repeat 5-10 times throughout the day

**What to observe:**
- Did child use a word or word approximation?
- Did child need a model first?
- Which items motivated verbal requests?""",
            "order_index": 1
        },
        {
            "title": "Two-Word Combinations",
            "why_description": "Combining words expands communication and helps child express more complex ideas. This is a key milestone in language development.",
            "instructions": """1. During play, model two-word phrases:
   - "More juice" / "Big ball" / "Go car"
2. When child requests, expand their word:
   - Child: "Ball" → You: "Want ball? Say 'want ball'"
3. Accept any two-word attempt
4. Praise and fulfill request immediately

**What to observe:**
- Did child attempt two words together?
- Which two-word phrases did child use?
- Was child frustrated or willing to try?""",
            "order_index": 2
        },
        {
            "title": "Answering 'What' Questions",
            "why_description": "Answering questions shows language comprehension and builds conversational skills needed for school and social situations.",
            "instructions": """1. Use familiar objects/pictures
2. Ask "What's this?" pointing to item
3. Wait 5 seconds for response
4. If no answer, give a choice: "Is it a dog or cat?"
5. Praise correct answers enthusiastically

**What to observe:**
- Did child answer independently?
- Did child need choices to answer?
- How many objects could child name?""",
            "order_index": 3
        },
        {
            "title": "Following 2-Step Directions",
            "why_description": "Following multi-step directions is essential for school readiness and builds working memory and language comprehension.",
            "instructions": """1. Give two-part instructions clearly:
   - "Get the ball AND bring it to me"
   - "Put the cup ON the table AND sit down"
2. Wait for child to complete both steps
3. If needed, repeat or use gestures
4. Celebrate completing both steps

**What to observe:**
- Did child complete both steps?
- Did child need help with second step?
- Did child understand the 'and' connection?""",
            "order_index": 4
        },
        {
            "title": "Greeting Practice",
            "why_description": "Social greetings are important for building relationships and are often expected in school and community settings.",
            "instructions": """1. Practice at natural greeting times:
   - Morning: "Say 'Good morning!'"
   - Arrivals: "Say 'Hi [name]!'"
   - Departures: "Say 'Bye bye!'"
2. Model the greeting first
3. Wait for child's attempt
4. Wave while greeting for visual support

**What to observe:**
- Did child greet spontaneously?
- Did child need prompting?
- Did child make eye contact while greeting?""",
            "order_index": 5
        }
    ]

    # Day 2 Tasks - Expressive Language
    day2_tasks = [
        {
            "title": "Describing with Adjectives",
            "why_description": "Using descriptive words helps children communicate more precisely and expands their vocabulary for richer expression.",
            "instructions": """1. Play with items of different sizes/colors
2. Model: "Big ball! Small ball!"
3. Ask child: "Is this big or small?"
4. Encourage child to describe items:
   - "What color is the car?"
   - "Is the water hot or cold?"

**What to observe:**
- Did child use adjectives independently?
- Which adjectives does child know?
- Could child answer adjective questions?""",
            "order_index": 1
        },
        {
            "title": "Telling About Actions",
            "why_description": "Describing actions builds verb vocabulary and helps child narrate experiences, essential for social conversation.",
            "instructions": """1. During active play, narrate actions:
   - "The boy is running! He's jumping!"
2. Ask: "What is he doing?" about pictures/videos
3. Model action words: run, jump, eat, sleep, play
4. Act out verbs and have child name them

**What to observe:**
- Did child use action words?
- Could child identify actions in pictures?
- Did child describe own actions?""",
            "order_index": 2
        },
        {
            "title": "Asking 'What' and 'Where'",
            "why_description": "Asking questions shows curiosity and advances communication from requests to real conversation.",
            "instructions": """1. Hide a favorite toy and say "Uh oh! Where's teddy?"
2. Model: "Ask me 'Where is it?'"
3. Create mystery: wrap item, ask "What's inside?"
4. Celebrate when child asks questions
5. Answer enthusiastically to reinforce asking

**What to observe:**
- Did child ask a question independently?
- Did child imitate your question?
- What motivated child to ask?""",
            "order_index": 3
        },
        {
            "title": "Conversation Turn-Taking",
            "why_description": "Back-and-forth conversation is the foundation of social communication and relationship building.",
            "instructions": """1. Have a simple conversation about preferred topic
2. Take turns: You say something, wait for child
3. Keep your turns short (1-2 sentences)
4. Comment on what child says: "Oh you like trucks!"
5. Ask follow-up questions: "What color truck?"

**What to observe:**
- Did child take conversational turns?
- Did child stay on topic?
- How many turns could you maintain?""",
            "order_index": 4
        },
        {
            "title": "Storytelling with Pictures",
            "why_description": "Sequencing and storytelling develop narrative skills needed for reading comprehension and social sharing.",
            "instructions": """1. Use a simple picture book or photo sequence
2. Ask "What's happening?" for each picture
3. Help child tell the story in order:
   - "First... Then... And then..."
4. Accept short descriptions
5. Expand child's answers into sentences

**What to observe:**
- Did child describe pictures?
- Did child use sequence words?
- Could child retell a simple story?""",
            "order_index": 5
        }
    ]

    # Day 3 Tasks - Receptive Language & Comprehension
    day3_tasks = [
        {
            "title": "Understanding Concepts",
            "why_description": "Concept understanding (in/out, up/down, big/small) is foundational for following directions and academic learning.",
            "instructions": """1. Practice spatial concepts during play:
   - "Put the toy IN the box"
   - "Take it OUT of the box"
   - "Put teddy ON the chair"
   - "Look UNDER the table"
2. Use real objects and actions
3. Praise correct understanding

**What to observe:**
- Which concepts does child understand?
- Did child need demonstration?
- Could child follow concept directions?""",
            "order_index": 1
        },
        {
            "title": "Identifying by Function",
            "why_description": "Understanding object functions shows deeper language comprehension beyond just naming objects.",
            "instructions": """1. Lay out 3-4 objects
2. Ask function questions:
   - "Which one do we eat with?"
   - "Which one do we wear?"
   - "Which one do we sleep on?"
3. If needed, demonstrate the function
4. Build to harder questions over time

**What to observe:**
- Did child identify by function correctly?
- Which categories were easiest?
- Did child need demonstration?""",
            "order_index": 2
        },
        {
            "title": "Following 3-Step Directions",
            "why_description": "Multi-step directions require attention, memory, and comprehension - all critical skills for classroom success.",
            "instructions": """1. Give 3-step directions during routines:
   - "Get your shoes, put them on, and come to the door"
   - "Pick up the book, put it on the shelf, and sit down"
2. Speak slowly and clearly
3. Use gestures if needed
4. Praise completing all steps

**What to observe:**
- Did child complete all 3 steps?
- Did child need reminders?
- Did child complete steps in order?""",
            "order_index": 3
        },
        {
            "title": "Answering 'Who' and 'Where' Questions",
            "why_description": "Answering various question types demonstrates language comprehension and prepares child for school interactions.",
            "instructions": """1. Use family photos or storybooks
2. Ask "Who is this?" pointing to people
3. Ask "Where is the dog?" about pictures
4. Accept pointing or verbal answers
5. Expand answers: "Yes! That's Daddy!"

**What to observe:**
- Did child answer correctly?
- Did child point or use words?
- Which question type was easier?""",
            "order_index": 4
        },
        {
            "title": "Categorization Game",
            "why_description": "Sorting into categories builds cognitive organization and vocabulary, supporting both language and thinking skills.",
            "instructions": """1. Gather items from 2-3 categories:
   - Animals, food, vehicles
2. Ask child to sort: "Put all the animals together"
3. Ask: "Is this an animal or a car?"
4. Name items as you sort together
5. Make it fun - race to sort!

**What to observe:**
- Did child sort correctly?
- Could child name the categories?
- Which categories were clearest?""",
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
            print(f"  Created Day {day_number}: {task_data['title']}")

    print(f"\n30-Day Communication Focus: Created {task_count} tasks")
    return task_count


def create_comprehensive_development_tasks():
    """Create tasks for 45-Day Comprehensive Development (moderate spectrum)"""

    curriculum = Curriculum.objects.filter(title='45-Day Comprehensive Development').first()
    if not curriculum:
        print("45-Day Comprehensive Development curriculum not found!")
        return

    # Delete existing tasks
    CurriculumTask.objects.filter(curriculum=curriculum).delete()

    # Day 1 Tasks - Foundation Skills
    day1_tasks = [
        {
            "title": "Attending to Faces",
            "why_description": "Looking at faces is the foundation for social connection, reading emotions, and learning language from lip movements.",
            "instructions": """1. Sit directly in front of child at eye level
2. Hold an interesting object near your eyes
3. When child looks at object, slowly move it to your eyes
4. Say child's name with enthusiasm
5. Celebrate ANY look toward your face (even brief)
6. Repeat 5-10 times throughout the day

**What to observe:**
- How long did child look at your face?
- Did child look at eyes or mouth?
- What helped child look at your face?
- Was there resistance to looking at faces?""",
            "order_index": 1
        },
        {
            "title": "Responding to Name",
            "why_description": "Responding to name is crucial for safety, attention in classroom settings, and social awareness of being addressed.",
            "instructions": """1. Say child's name once, clearly
2. Wait 5 seconds for any response
3. If no response, say name + touch shoulder gently
4. Praise ANY response: head turn, eye contact, verbal
5. Practice from different distances and rooms
6. Try 10 times throughout the day

**What to observe:**
- Did child respond consistently?
- What distance worked best?
- Did child respond from another room?
- How many prompts were needed?""",
            "order_index": 2
        },
        {
            "title": "Simple Imitation",
            "why_description": "Imitation is how children learn new skills. Building imitation ability opens doors to learning language, play, and social behaviors.",
            "instructions": """1. Start with gross motor actions:
   - Clap hands, wave, stomp feet
2. Say "Do this!" and demonstrate
3. Wait 5 seconds for child to try
4. Use hand-over-hand help if needed
5. Praise ALL attempts, even partial
6. Practice 5-10 imitations daily

**What to observe:**
- Which actions could child imitate?
- Did child need physical help?
- Was there a delay before imitating?
- Did child seem interested in copying you?""",
            "order_index": 3
        },
        {
            "title": "Accepting Touch",
            "why_description": "Tolerating and enjoying appropriate touch is important for daily care, affection, and social interactions with family and peers.",
            "instructions": """1. Start with child's preferred touch (firm/light)
2. Give brief, predictable touches:
   - High fives, gentle squeezes, back pats
3. Pair with preferred activities or praise
4. Respect child's boundaries
5. Gradually increase duration if tolerated
6. Watch for signs of overstimulation

**What to observe:**
- What type of touch does child prefer?
- How long could child tolerate touch?
- Did child seek out touch or avoid it?
- Were there specific areas child didn't like touched?""",
            "order_index": 4
        },
        {
            "title": "Basic Waiting",
            "why_description": "Learning to wait is essential for self-regulation, following routines, and participating in group activities later.",
            "instructions": """1. Hold desired item and say "Wait"
2. Show open palm (stop gesture)
3. Start with 3-second wait, then give item
4. Gradually increase to 10 seconds
5. Use visual timer if helpful
6. Praise calm waiting enthusiastically

**What to observe:**
- How long could child wait?
- Did child stay calm or get upset?
- Did visual timer help?
- What strategies helped child wait?""",
            "order_index": 5
        }
    ]

    # Day 2 Tasks - Engagement & Interaction
    day2_tasks = [
        {
            "title": "Shared Enjoyment",
            "why_description": "Sharing enjoyable moments builds social connection and teaches child that being with others is fun and rewarding.",
            "instructions": """1. Do an activity child LOVES
   - Bubbles, tickles, spinning, songs
2. Stop the activity suddenly
3. Wait for child to look at you or request more
4. Show big, happy reaction when child connects
5. Resume activity immediately as reward
6. Practice "start-stop-start" pattern

**What to observe:**
- Did child look at you when activity stopped?
- Did child try to get you to continue?
- Did child smile or laugh with you?
- How did child request 'more'?""",
            "order_index": 1
        },
        {
            "title": "Pointing to Share",
            "why_description": "Pointing to share interest (not just to request) shows child wants to connect with you about the world around them.",
            "instructions": """1. Point excitedly at something interesting
2. Say "Look! Wow!" with enthusiasm
3. Wait for child to look where you point
4. When something catches child's attention, help them point
5. Say "Show Mommy/Daddy!"
6. Celebrate shared attention moments

**What to observe:**
- Did child follow your point?
- Did child point to show you things?
- Was pointing just for requesting or also sharing?
- Did child look back at you after looking at object?""",
            "order_index": 2
        },
        {
            "title": "Simple Social Games",
            "why_description": "Repetitive social games teach turn-taking, anticipation, and the joy of predictable social interaction.",
            "instructions": """1. Play simple back-and-forth games:
   - Peek-a-boo
   - Pat-a-cake
   - Row-row-row your boat
2. Use the same words each time
3. Pause and wait for child to participate
4. Make it fun and silly
5. Let child take a 'turn' leading

**What to observe:**
- Did child anticipate what comes next?
- Did child participate or just watch?
- Did child laugh or smile during games?
- Did child want to repeat the game?""",
            "order_index": 3
        },
        {
            "title": "Parallel Play Building",
            "why_description": "Playing alongside another person is a stepping stone to interactive play and helps child get comfortable with shared play spaces.",
            "instructions": """1. Sit near child with same/similar toys
2. Play with your own toy, narrating aloud
3. Don't demand interaction - just be present
4. Occasionally comment on child's play
5. Offer exchanges: "Want to try my red block?"
6. Celebrate any moves toward interactive play

**What to observe:**
- Did child tolerate your presence?
- Did child watch your play?
- Did child move closer or away?
- Were there moments of shared play?""",
            "order_index": 4
        },
        {
            "title": "Making Choices",
            "why_description": "Making choices builds independence, communication, and gives child a sense of control over their environment.",
            "instructions": """1. Offer two clear choices throughout day:
   - "Apple or banana?"
   - "Red shirt or blue shirt?"
2. Hold items up at child's eye level
3. Wait for child to look, reach, or vocalize
4. Accept any clear indication of choice
5. Honor the choice immediately
6. Name what child chose

**What to observe:**
- How did child indicate choices?
- Were choices consistent or random?
- Did child get frustrated choosing?
- Could child choose between non-preferred items?""",
            "order_index": 5
        }
    ]

    # Day 3 Tasks - Communication & Daily Living
    day3_tasks = [
        {
            "title": "Requesting with Gestures",
            "why_description": "Gestures are a stepping stone to verbal communication and help child express needs without frustration.",
            "instructions": """1. Model gestures for common requests:
   - Reaching = "want"
   - Waving = "bye"
   - Pushing away = "no/all done"
2. When child wants something, help them gesture
3. Say the word while child gestures
4. Give item/action immediately
5. Practice throughout daily routines

**What to observe:**
- Which gestures did child use?
- Did child need physical help to gesture?
- Did gestures reduce frustration?
- Was child starting to use gestures independently?""",
            "order_index": 1
        },
        {
            "title": "Following One-Step Directions",
            "why_description": "Following directions is essential for safety, learning new skills, and participating in structured activities.",
            "instructions": """1. Give clear, simple directions:
   - "Sit down"
   - "Come here"
   - "Give me the cup"
2. Use gesture with words
3. Wait 5 seconds for response
4. Help physically if needed
5. Praise following directions enthusiastically
6. Practice with different directions

**What to observe:**
- Which directions could child follow?
- Did child need gesture support?
- Did child need physical help?
- How consistent was direction-following?""",
            "order_index": 2
        },
        {
            "title": "Sensory Exploration Time",
            "why_description": "Sensory play helps children regulate their bodies and can be calming or alerting depending on the input provided.",
            "instructions": """1. Set up a sensory activity:
   - Playdough, water play, sand, rice bins
2. Let child explore at own pace
3. Don't direct - follow child's lead
4. Describe what child is doing
5. Note what textures child seeks or avoids
6. Use this as calm-down activity

**What to observe:**
- What sensory input did child seek?
- What did child avoid?
- Did sensory play help child regulate?
- How long could child engage?""",
            "order_index": 3
        },
        {
            "title": "Mealtime Skills",
            "why_description": "Independent eating builds self-help skills, fine motor control, and prepares child for eating in school and social settings.",
            "instructions": """1. During meals, practice one skill:
   - Using spoon to scoop
   - Drinking from open cup
   - Using fork to stab
2. Use hand-over-hand help initially
3. Reduce help as child learns
4. Praise all attempts at independence
5. Keep meals relaxed - skills come with practice

**What to observe:**
- What eating skills does child have?
- How much help was needed?
- Was child interested in self-feeding?
- Were there texture or food preferences?""",
            "order_index": 4
        },
        {
            "title": "Calming Strategies",
            "why_description": "Learning to calm down is essential for managing emotions and preventing meltdowns. Every child needs a 'toolkit' of calming strategies.",
            "instructions": """1. When child is calm, practice calming activities:
   - Deep breaths (blow bubbles to practice)
   - Tight hugs or pressure
   - Quiet space with dim lights
   - Favorite calming music
2. Use same calming words each time
3. Practice daily so child learns the routine
4. Use strategies at first sign of upset

**What to observe:**
- What helped child calm down?
- Could child use strategy independently?
- What were early signs of upset?
- How long did calming take?""",
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
            print(f"  Created Day {day_number}: {task_data['title']}")

    print(f"\n45-Day Comprehensive Development: Created {task_count} tasks")
    return task_count


if __name__ == "__main__":
    print("=" * 60)
    print("Creating Specialized Curriculum Tasks")
    print("=" * 60)

    print("\n--- 30-Day Communication Focus (Mild Spectrum) ---")
    comm_count = create_communication_focus_tasks()

    print("\n--- 45-Day Comprehensive Development (Moderate Spectrum) ---")
    comp_count = create_comprehensive_development_tasks()

    print("\n" + "=" * 60)
    print(f"Total tasks created: {comm_count + comp_count}")
    print("Done!")
