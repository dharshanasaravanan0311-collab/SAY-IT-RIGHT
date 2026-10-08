"""
Pre-loaded High-Stakes Scenarios for 'Say It Right'
Taxonomy of academic, early-career, and crucial interpersonal communication dilemmas.
"""

SCENARIOS = [
    # ACADEMIC SUITE
    {
        "id": "academic_extension",
        "category": "Academic",
        "category_icon": "graduation-cap",
        "title": "Emergency Assignment Extension",
        "subtitle": "Asking a professor for a 48-hour extension during a crisis",
        "recipient_role": "Professor / Course Instructor",
        "stakes": "High",
        "recipient_mindset": "Manages 200+ students. Fatigued by vague excuses, but receptive to accountability, specific dates, and concise solutions.",
        "common_pitfalls": [
            "Over-apologizing ('I am so so sorry to bother you')",
            "Over-sharing private medical details instead of functional impact",
            "Leaving the new deadline open-ended ('whenever you want')",
            "Forgetting to include course number and section"
        ],
        "sample_raw_draft": "Hi Professor, I'm really sorry to bother you because I know you're super busy. I know the paper is due tonight and I've been really stressed and had personal stuff happen and I haven't been able to finish. I feel terrible about this. Is there anyway I could maybe get some extra time please? Sorry again.",
        "rules_of_thumb": [
            "State the request in the first 2 sentences.",
            "Propose a concrete alternative deadline (e.g., 'Friday, Oct 12 at 5:00 PM').",
            "Express gratitude for their flexibility rather than apologizing multiple times."
        ]
    },
    {
        "id": "academic_regrade",
        "category": "Academic",
        "category_icon": "graduation-cap",
        "title": "Respectful Grade Review / Inquiry",
        "subtitle": "Inquiring about rubric deductions without sounding entitled or accusatory",
        "recipient_role": "Professor or Teaching Assistant",
        "stakes": "Medium-High",
        "recipient_mindset": "Defensive against grade-grubbing. Highly responsive when student frames it as a desire to understand concepts rather than disputing points.",
        "common_pitfalls": [
            "Sounding accusatory ('You took off points unfairly')",
            "Focusing solely on the letter grade rather than rubric feedback",
            "Demanding an immediate regrade"
        ],
        "sample_raw_draft": "Hey, I saw my grade on Exam 2 and I think I was graded harshly on Question 4. I answered everything based on the textbook. Can you check it again and give me back my points?",
        "rules_of_thumb": [
            "Frame the inquiry around understanding the rubric criteria.",
            "Cite the specific question and attach your original reasoning objectively.",
            "Request a brief 5-minute meeting during office hours if asynchronous review is inconvenient."
        ]
    },
    {
        "id": "academic_recommendation",
        "category": "Academic",
        "category_icon": "graduation-cap",
        "title": "Letter of Recommendation Request",
        "subtitle": "Asking a busy professor for a recommendation without imposing",
        "recipient_role": "Department Chair / Faculty Mentor",
        "stakes": "High",
        "recipient_mindset": "Wants to help dedicated students, but needs 3-4 weeks lead time and packaged materials (resume, draft statement, bullet points) to write efficiently.",
        "common_pitfalls": [
            "Giving less than 2-3 weeks notice",
            "Not providing context on how they know you or your specific achievements in their class",
            "Assuming they remember your work without attaching writing samples"
        ],
        "sample_raw_draft": "Hi Dr. Roberts, I need a letter of recommendation for summer internships due next week. Could you write one for me? Thanks!",
        "rules_of_thumb": [
            "Give at least 3 weeks notice before the deadline.",
            "Provide an easy 'out' so they don't feel coerced if their schedule is full.",
            "Attach a summary packet: resume, program description, and key projects you completed in their class."
        ]
    },
    {
        "id": "academic_missed_class",
        "category": "Academic",
        "category_icon": "graduation-cap",
        "title": "Admitting Falling Behind / Missed Lectures",
        "subtitle": "Reaching out after missing multiple classes due to illness or burnout",
        "recipient_role": "Academic Advisor or Course Instructor",
        "stakes": "High",
        "recipient_mindset": "Worried about student retention and safety, but frustrated by disappearing acts. Respects proactive re-engagement and clear recovery plans.",
        "common_pitfalls": [
            "Asking 'Did I miss anything important?' (implies classes aren't normally important)",
            "Ghosting until finals week",
            "Expecting the professor to re-teach lectures via email"
        ],
        "sample_raw_draft": "Hey, sorry I haven't been in class for the past two weeks. Did I miss anything important? Can you tell me what I need to do to pass?",
        "rules_of_thumb": [
            "Never ask 'Did I miss anything important?'.",
            "Confirm that you've reviewed the syllabus and reached out to peers for notes.",
            "Propose a concrete recovery plan and ask for clarification on missed submission policies."
        ]
    },

    # EARLY CAREER / WORKPLACE SUITE
    {
        "id": "work_delay",
        "category": "Early Career",
        "category_icon": "briefcase",
        "title": "Pushing Back on an Unrealistic Deadline",
        "subtitle": "Negotiating scope or delivery date with a manager without sounding unwilling",
        "recipient_role": "Engineering Lead / Project Manager",
        "stakes": "High",
        "recipient_mindset": "Needs predictability for stakeholders. Values trade-off choices (Scope vs. Quality vs. Time) over last-minute surprise delays.",
        "common_pitfalls": [
            "Suffering in silence until the deadline passes",
            "Saying flat out 'I can't do this' without alternatives",
            "Complaining about workload without data"
        ],
        "sample_raw_draft": "Hi Sarah, there is way too much stuff assigned for this Friday. I'm totally overwhelmed and I don't think I can finish the analytics dashboard in time. Can we push it back?",
        "rules_of_thumb": [
            "Raise timeline concerns early, not the night before.",
            "Present trade-off options: 'I can deliver Feature A on Friday if we defer Feature B to next Tuesday.'",
            "Frame it as protecting quality and stability."
        ]
    },
    {
        "id": "work_bug",
        "category": "Early Career",
        "category_icon": "briefcase",
        "title": "Reporting a Mistake or Production Bug",
        "subtitle": "Owning a blunder professionally before someone else discovers it",
        "recipient_role": "Engineering Lead / Team",
        "stakes": "Critical",
        "recipient_mindset": "Focused 100% on containment and fix; zero tolerance for cover-ups or finger-pointing. Respects rapid ownership and mitigation steps.",
        "common_pitfalls": [
            "Hiding the mistake hoping nobody notices",
            "Blaming tooling or ambiguous requirements",
            "Panicking in public channels without a summary of impact"
        ],
        "sample_raw_draft": "Hey, I think I broke the staging database migration. I was testing something and ran the wrong script. It's not totally my fault because the script wasn't labeled, but what should I do now?",
        "rules_of_thumb": [
            "State the exact issue, current impact, and containment status immediately.",
            "Own the action cleanly without shifting blame to unclear tooling.",
            "Outline your proposed fix and ask for verification before applying it."
        ]
    },
    {
        "id": "work_asking_help",
        "category": "Early Career",
        "category_icon": "briefcase",
        "title": "Asking for Help When Stuck",
        "subtitle": "Getting unblocked by senior colleagues without sounding incompetent",
        "recipient_role": "Senior Engineer / Mentor",
        "stakes": "Medium",
        "recipient_mindset": "Wants juniors to learn, but annoyed by 'helpless' questions where the asker hasn't documented what they tried.",
        "common_pitfalls": [
            "Asking 'Can you jump on a call?' with zero context",
            "Spinning wheels for 2 days in secret",
            "Failing to list attempted debugging steps"
        ],
        "sample_raw_draft": "Hey, I'm stuck on this auth token error. Nothing works and I don't know what to do. Can you hop on a call to fix it for me?",
        "rules_of_thumb": [
            "The 15-Minute Rule: Try on your own, then ask before losing half a day.",
            "Provide the 3-part formula: (1) The goal, (2) What I tried, (3) The specific hypothesis or error.",
            "Keep the initial ask asynchronous with relevant links and logs."
        ]
    },

    # CRUCIAL PERSONAL SUITE
    {
        "id": "personal_boundary",
        "category": "Personal & Boundaries",
        "category_icon": "shield",
        "title": "Saying No to Lending Money or Gear",
        "subtitle": "Refusing a difficult favor without destroying the friendship",
        "recipient_role": "Close Friend or Acquaintance",
        "stakes": "High Emotional Risk",
        "recipient_mindset": "Vulnerable and hoping for support. Needs gentle clarity without leaving room for repeated negotiation.",
        "common_pitfalls": [
            "Making up elaborate fake excuses that can be probed",
            "Ghosting the message out of guilt",
            "Giving a tentative 'maybe later' when you mean 'no'"
        ],
        "sample_raw_draft": "Hey, um I really wish I could help you out with the 300 dollars, but my bank account is kind of tight right now and I don't know if I can. Maybe next month if things get better? Sorry to let you down.",
        "rules_of_thumb": [
            "Keep the refusal kind, direct, and unencumbered by fake excuses.",
            "Do not promise 'maybe next time' if you do not intend to lend.",
            "Reaffirm the friendship while holding the financial boundary firmly."
        ]
    },
    {
        "id": "personal_cancel",
        "category": "Personal & Boundaries",
        "category_icon": "shield",
        "title": "Canceling a Commitment Last-Minute",
        "subtitle": "Bailing on an event due to exhaustion/burnout without seeming flaky",
        "recipient_role": "Friend or Group Organizer",
        "stakes": "Medium Emotional Risk",
        "recipient_mindset": "Disappointed by the cancellation, especially if seats or bookings were reserved. Appreciates early honesty and proactive rescheduling.",
        "common_pitfalls": [
            "Waiting until 10 minutes before the event to message",
            "Lying about an emergency that gets debunked on social media",
            "Not offering to cover costs or reschedule"
        ],
        "sample_raw_draft": "Hey so I don't think I can make it tonight, I'm just really tired from work. Hope you guys have fun without me, sorry!",
        "rules_of_thumb": [
            "Send the message as early as humanly possible.",
            "Acknowledge the inconvenience caused to the host.",
            "Propose a specific reschedule date or offer to pay your share if reservations were made."
        ]
    }
]

def get_scenario_by_id(scenario_id: str):
    for s in SCENARIOS:
        if s["id"] == scenario_id:
            return s
    return None
