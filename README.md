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


| Case | Input or action | Expected result / success criterion | Actual result | Pass, partial, or fail | Implication or next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | A newcomer who is open to different denominations: no Must Haves, Nice to Have contemporary worship, within 10 miles. | A ranked list of nearby churches across denominations, with different match scores and a "Why this matched" line that mentions worship style and distance. | Predicted, not yet tested: a mix of nearby denominations with different scores (e.g., 88%, 74%, 61%), each explaining worship style and distance. | Predicted pass | If scores still cluster together, give Nice to Have answers more weight in the ranking. |
| Typical 2 | A user set on a denomination: Baptist as a Must Have, traditional hymns as Nice to Have, English-language service. | Only Baptist churches appear, with hymn-style churches ranked higher. No Catholic or Presbyterian churches. | Predicted, not yet tested: only Baptist churches appear, ranked by worship style. Before the revision, this same input returned Catholic churches. | Predicted pass | Keep the automated test for this case so the Must Have filter does not break in later changes. |
| Challenge | Contradictory Must Haves: both Catholic and Baptist marked as Must Have. | The app does not quietly pick one. It explains that no church can meet both and asks the user to relax one Must Have. | Predicted, not yet tested: the app shows the "No churches match all your must-haves" message, but does not say which two choices conflict. | Predicted partial | Name the conflicting Must Haves in the message so the user knows what to change. |
| Invalid or empty | Submit the questionnaire with no answers. | No crash and no made-up match scores. The app asks the user to answer at least the core questions, or clearly labels results as a general list. | Predicted, not yet tested: no crash, but the app shows a general list with match percentages that are not based on any answers. | Predicted partial | Require the 5 core questions before matching, or hide scores and label the list as general results. |
| Risk | Must Have a Spanish-language service, for a church whose listing has no language information. | The app does not claim the church offers Spanish services. Missing details show as "Not listed," and the user can remove the church with "Not for me" or change preferences. A misleading match here could send someone to a service they cannot follow. | Predicted, not yet tested: the AI may guess the church offers Spanish services based on its name or neighborhood and give it a high match. | Predicted fail | Only show details that are in the church data, mark missing details as "Not listed," and treat a missing Must Have as not met. |

### What Does the Evidence Tell Me?

Based on the revisions, the part I expect to work reasonably well now is the core promise: treating Must Haves as hard filters should finally make results change with the user's answers, so a Baptist-only search returns only Baptist churches instead of the same generic list. What remains unreliable is how the app handles edge cases and missing information. Conflicting Must Haves may produce a dead end without explaining why, an empty questionnaire may still show match percentages that mean nothing, and the AI may fill gaps in church data with guesses, like assuming a Spanish-language service, which is the riskiest failure because it could send someone to a church that does not fit them. Images, the shorter form, and the "Why this matched" explanations are also still untested. If the filtering tests pass, the results would support part of the value I claim: a newcomer can trust that their non-negotiables are respected. They would not yet support the claim that the AI finds a good cultural or community fit, since none of these tests measure match quality. Next, I would run these five cases for real, fix the risk case so the app only shows details that are in the church data, add a clearer message for conflicting Must Haves, and ask a few people who are actually church hunting to try it and tell me whether their top matches felt right. It's still not working exactly how I would like to, but I am seeing improvements ! 

## Address One Concrete Risk

**Risk chosen:** the AI presenting guessed church details as facts.

**Status:** This safeguard is being built in the revised prototype and is not yet confirmed working. The Risk test case above will check it.

**What I am changing:**

- The AI may only describe a church using details that are in the church data. It cannot guess things like service language, worship style, or beliefs from a church's name or neighborhood.
- Any detail that is missing from the data shows as "Not listed" on the result card.
- If a Must Have can't be confirmed from the data (for example, a Spanish-language service when no language is listed), it counts as not met. The church is not shown as a match.
- Each result card says "Confirm details with the church before visiting," next to the details themselves, not as a footer disclaimer.
- Users can reject an unsuitable result with "Not for me" and change their preferences without restarting the questionnaire.

The people most affected are newcomers who rely on the app because they don't know the area yet, especially users who need a service in a specific language or who care deeply about a church's beliefs. If the AI guessed a detail and showed it as fact, someone could drive to a service they can't understand, or join a community whose teachings don't match their own, and they would have no reason to doubt the high match score. This connects to the course theme of over-reliance on AI: a confident percentage and a polished card encourage users to trust the output without checking it. It also connects to fairness, because the guesses would most likely be wrong for smaller, immigrant, or less-documented churches whose listings have less information, making them look like worse matches or misrepresenting them. My change keeps the AI to the facts it actually has, makes missing information visible, and keeps the user in control of rejecting results. The remaining risk is that the church data itself can be outdated or incomplete. "Not listed" may also hide good churches that simply have sparse listings, and users may still treat the match score as a recommendation rather than a starting point.

## AI-Use Disclosure

**Tools used**

- **Claude (Anthropic):** for planning revisions, turning peer feedback into fix lists, drafting prompts for Replit, and drafting and editing sections of this README. Claude also made the README edits in this repo through the Claude in Chrome extension, at my request.
- **Replit Agent:** to write and change the app code.
- **AI model inside the product:** claude !.

**Development assistance**

AI helped me turn scattered peer-review comments into a prioritized list of fixes, write step-by-step prompts for Replit Agent, plan test cases, and draft the feedback, evaluation, and risk sections of this README. Replit Agent wrote and edited the code for matching, filtering, the questionnaire, and tests. I decided which feedback to act on, adapt, or defer, chose the risk to address, and reviewed everything before committing it.

**Representative prompts**

1. *To Claude:* "Write me a prompt to feed into Replit that would make it fix these things," with my peer feedback pasted in. **Produced:** one long Replit prompt covering every issue. **What I changed:** I asked for it to be split into six smaller prompts so Replit Agent handles one fix at a time and I can check each change before moving on.
2. *To Replit Agent:* "Treat every 'Must Have' answer as a HARD FILTER that runs before any ranking. Example: if Baptist is a Must Have, no Catholic, Presbyterian, or other non-Baptist churches may appear." **Produced:** [describe what Replit changed]. **What I changed:** [describe any fixes or follow-up prompts].
3. *To Claude:* "Can you write some expected or hypothetical values in the tables?" **Produced:** predicted results for my five test cases. **What I changed:** I kept these clearly labeled "Predicted, not yet tested" instead of presenting them as real results, and I will replace them after running each case.

**Human judgment**

- An early AI draft of my peer-feedback table marked every fix as "Acted on" and described the changes as finished, even though the app code was not yet in this repo. I revised it to show which fixes were still in progress, so the README only claims what is actually in the app.
- I rejected the single long Replit prompt in favor of smaller step-by-step prompts, because one large change made it hard to tell what Replit had actually modified.
- I deferred the suggestion that "Not for me" should train the algorithm over time, because it would require user accounts and stored history that are beyond this project's scope.

**Verification**

I compared each AI-drafted section against the actual peer feedback and my original test results, previewed every README change on GitHub before committing, and checked that no classmate names or API keys appear in the repo. **Still needs checking:** running the five test cases on the revised app and replacing the predicted results with real ones, confirming each Replit change works as described, and confirming the published link opens for reviewers.

**AI inside the product**

- **Task:** match a user with local churches based on their questionnaire answers.
- **Inputs:** the user's answers (denomination, worship style, distance, language, service time, plus optional extra questions) marked as Must Have, Nice to Have, or Doesn't Matter, along with the church data.
- **Outputs:** a ranked list of churches with match percentages and a "Why this matched" explanation.
- **Current status:** in the first prototype, the AI matching ran through an API, but it returned the same results regardless of user input. In the revision, Must Have answers are handled by rule-based filtering before the AI ranks the remaining churches. See "AI: Working vs. Simulated" for which parts are live AI and which are rule-based or sample data.
