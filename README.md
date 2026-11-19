# [Gatherwell]

> [Gatherwell is a church matching platform for people church hunting in a new area with things like type of worship music, core beliefs, images of the church, culture, and htings like that!]

## How to Open the Prototype

[Open link. Choose "Find My Church". Fill out the questionnare. Choose a church you're interested in. Click save. ]

## First Working Slice

[Fill out the questionnaire with preferences. Be able to save an option you like. ]

## AI Behavior Status

* **Status:** [Working AI via API.]
* [The AI is the one that does the matching process itself.]

## Test Results

1. **Test 1:** [Pass] – [Produced great options for an individual who was open to different things.]
2. **Test 2:** [Fail] – [When I clicked "must have" for a lot of the topics, the AI yielded the same options as the original so it wasn't specific to the individual. We don't want that.]
3. **Test 3:** [Fail] – [Did the same thing as test 2. Wasn't specific to an individual or ask clarifying questions or anything along those lines. Bottom line, not specific enough to a person activley church hunting.]

## Known Limitations

* [Pictures not working !!]
* [Producing the same generic list rather than unique to the individuals actual preferences]
Replace all the bracketed text [...] with your project's actual details.Click the green Commit changes... button at the top-right of the screen.   Click Commit changes in the pop-up menu to save it.


## Show How I Used Peer Feedback

I received three peer reviews and an instructor score breakdown. Two reviewers could not open the prototype (the Replit link showed a "Run this app" or "not available" message), so they reviewed the README and screenshots instead. One reviewer completed the questionnaire and saw results. The most consistent feedback was that results did not change based on the user's answers, especially "Must Have" choices. Revisions are in progress, and I will update this table as each fix is finished.

| Feedback or observed issue | Decision | What changed, or why it was deferred |
| --- | --- | --- |
| Matching returned the same churches no matter what the user answered (also shown in my own tests). | Acted on | In progress: rewriting the matching so answers change the results. Churches are filtered first, then ranked by "Nice to Have" preferences. |
| "Must Have" answers were not respected (e.g., Baptist as a Must Have still returned Catholic churches). | Acted on | In progress: Must Have answers become hard filters applied before any AI ranking. If no church meets every Must Have, the app will say so instead of showing poor matches. |
| Add a test to check the Must Have rule. | Acted on | In progress: adding tests that check Must Have filtering and that different answers produce different results. These tests check that the app follows the user's rules; they do not prove the AI's matches are accurate. |
| Different churches showed the same match score, making it unclear whether the AI used the answers. | Acted on | In progress: each result will show a "Why this matched" line listing which preferences it met and missed. |
| The README said "Working AI via API," but it was not clear what was real vs. simulated. | Acted on | In progress: adding an "AI: Working vs. Simulated" section explaining which parts use a live AI model, which are rule-based, and whether church data is real or sample data. |
| Church images were broken. | Acted on | In progress: fixing image links and adding a placeholder for images that fail to load. |
| Reviewers could not open the prototype, and this repo only contained the README. | Acted on | In progress: publishing a stable .replit.app link and adding the full app code to this repo, with API keys kept in Replit Secrets. |
| The questionnaire is long; offer a shorter default form. | Adapted | The default form will ask 5 core questions (denomination, worship style, distance, language, service time), with optional extra questions for users who want more precise matches. |
| The "Not for me" button could help the algorithm learn. | Deferred | "Not for me" will remove a church from the current results, but learning across sessions would need user accounts and stored history, which is beyond this project's scope and timeline. |

I prioritized the issues that broke the core task first: matching that ignored user input, the unreachable app, and the missing code. A church-matching tool only works if users trust that their non-negotiables, like denomination, are respected. Next come fixes for clarity and trust (identical scores, broken images, unclear AI documentation). I adapted the shorter-form idea so the app is faster for new users without losing detail for people who want it, and deferred cross-session learning because it does not fit this project's scope or time.

## Evaluate the Revised Prototype

Five test cases for the revised prototype. Before each test I wrote what a successful response should look like. The Actual result, Pass/partial/fail, and Next step columns will be filled in after I run each case on the revised app.

| Case | Input or action | Expected result / success criterion | Actual result | Pass, partial, or fail | Implication or next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | A newcomer who is open to different denominations: no Must Haves, Nice to Have contemporary worship, within 10 miles. | A ranked list of nearby churches across denominations, with different match scores and a "Why this matched" line that mentions worship style and distance. | To be recorded | To be recorded | To be recorded |
| Typical 2 | A user set on a denomination: Baptist as a Must Have, traditional hymns as Nice to Have, English-language service. | Only Baptist churches appear, with hymn-style churches ranked higher. No Catholic or Presbyterian churches. | To be recorded | To be recorded | To be recorded |
| Challenge | Contradictory Must Haves: both Catholic and Baptist marked as Must Have. | The app does not quietly pick one. It explains that no church can meet both and asks the user to relax one Must Have. | To be recorded | To be recorded | To be recorded |
| Invalid or empty | Submit the questionnaire with no answers. | No crash and no made-up match scores. The app asks the user to answer at least the core questions, or clearly labels results as a general list. | To be recorded | To be recorded | To be recorded |
| Risk | Must Have a Spanish-language service, for a church whose listing has no language information. | The app does not claim the church offers Spanish services. Missing details show as "Not listed," and the user can remove the church with "Not for me" or change preferences. A misleading match here could send someone to a service they cannot follow. | To be recorded | To be recorded | To be recorded |
