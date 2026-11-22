export type ProfileType = 'individual' | 'couple';
export type Importance = 'must' | 'prefer' | 'matter' | 'figuring';

export type Preferences = {
  city: string;
  zip: string;
  travel: string;
  profileType: ProfileType;
  denomination: string;
  denominationImportance: Importance;
  denominationMustHaves: string[];
  language: string;
  languageImportance: Importance;
  serviceTime: string;
  beliefs: Record<string, Importance>;
  worship: string[];
  worshipImportance: Importance;
  community: Record<string, Importance>;
  size: string;
  mission: Record<string, Importance>;
  practical: Record<string, Importance>;
  notes: string;
};

export type Church = {
  id: string;
  name: string;
  denomination: string;
  languages: string[];
  location: string;
  distance: number;
  size: string;
  worship: string[];
  serviceTimes: string[];
  description: string;
  beliefs: string[];
  community: string[];
  youngAdults: string[];
  youngMarried: string[];
  mission: string[];
  practical: string[];
  parking: string;
  childcare: string;
  accessibility: string;
  online: string;
  source: 'Church-provided' | 'Platform verified' | 'User reported';
  website: string;
  palette: string;
};

export const denominationOptions = [
  'Non-denominational', 'Baptist', 'Catholic', 'Presbyterian', 'Methodist',
  'Lutheran', 'Anglican / Episcopal', 'Orthodox', 'Pentecostal', 'Vineyard', 'Church of Christ', 'Other',
];
export const beliefOptions = ['Baptism', 'Communion', 'Biblical authority', 'Worship practices', 'Spiritual gifts', 'Women’s roles in church', 'Marriage and family', 'Evangelism', 'Missions', 'Small groups', 'Contemporary vs traditional theology'];
export const worshipOptions = ['Contemporary', 'Traditional', 'Blended', 'Acoustic', 'Full worship band', 'Choir', 'Liturgical', 'Quiet / reflective', 'High-energy', 'Doesn’t matter'];
export const communityOptions = ['Young adults', 'Young married couples', 'Families', 'Singles', 'College students', 'Multi-generational', 'Small groups', 'Bible studies', 'Men’s groups', 'Women’s groups', 'Marriage groups', 'Social events', 'Service opportunities'];
export const missionOptions = ['Local community service', 'Missions', 'Evangelism', 'Discipleship', 'Family', 'Young adults', 'Social justice', 'Bible study', 'Fellowship', 'Serving others', 'Outreach', 'Spiritual growth'];
export const practicalOptions = ['Childcare', 'Children’s ministry', 'Student ministry', 'Parking', 'Accessibility', 'Online services', 'Multiple service times', 'Weekday groups', 'Weekend groups', 'Volunteer opportunities', 'Coffee / social spaces', 'Events for young adults'];

const seed = (id: string, name: string, denomination: string, location: string, distance: number, size: string, worship: string[], serviceTimes: string[], description: string, beliefs: string[], community: string[], youngAdults: string[], youngMarried: string[], mission: string[], practical: string[], parking: string, childcare: string, accessibility: string, online: string, source: Church['source'], palette: string): Church => ({ id, name, denomination, languages: ['English', ...(['new-life', 'the-gathering', 'city-church'].includes(id) ? ['Spanish'] : [])], location, distance, size, worship, serviceTimes, description, beliefs, community, youngAdults, youngMarried, mission, practical, parking, childcare, accessibility, online, source, website: `https://${id}.example`, palette });

export const churches: Church[] = [
  seed('new-life', 'New Life Community Church', 'Non-denominational', 'Broad Ripple, Indianapolis', 5.8, 'Medium', ['Contemporary', 'Full worship band', 'Quiet / reflective'], ['Saturday 5:00 PM', 'Sunday 9:00 AM', 'Sunday 11:00 AM'], 'A welcoming neighborhood church with thoughtful teaching, weeknight tables, and a strong rhythm of serving close to home.', ['Biblical authority', 'Baptism', 'Communion', 'Small groups', 'Marriage and family'], ['Young adults', 'Young married couples', 'Small groups', 'Service opportunities', 'Social events'], ['Tuesday table groups', 'Monthly city walks'], ['Newlywed circles', 'Dinner groups'], ['Local community service', 'Discipleship', 'Fellowship', 'Serving others'], ['Parking', 'Childcare', 'Accessibility', 'Online services', 'Weekday groups', 'Coffee / social spaces', 'Events for young adults'], 'Large shared lot behind the building', 'Nursery through age 5 during Sunday services', 'Step-free entry and accessible restrooms', 'Sunday livestream and sermon archive', 'Church-provided', 'sage'),
  seed('the-gathering', 'The Gathering', 'Baptist', 'Fountain Square, Indianapolis', 7.4, 'Small', ['Contemporary', 'Acoustic', 'High-energy'], ['Sunday 10:30 AM'], 'A small, hospitable congregation known for honest questions, shared meals, and hands-on neighborhood partnerships.', ['Biblical authority', 'Baptism', 'Evangelism', 'Missions', 'Small groups'], ['Young adults', 'Singles', 'Social events', 'Service opportunities', 'Bible studies'], ['Thursday discussion nights', 'Creative meetups'], ['Sunday supper table'], ['Local community service', 'Outreach', 'Evangelism', 'Serving others'], ['Parking', 'Accessibility', 'Weekend groups', 'Volunteer opportunities', 'Coffee / social spaces'], 'Street parking plus nearby paid lot', 'Family room, no staffed childcare', 'Portable ramp at side entrance', 'Audio sermons posted weekly', 'Platform verified', 'terracotta'),
  seed('city-church', 'City Church', 'Non-denominational', 'Downtown Indianapolis', 8.2, 'Large', ['Contemporary', 'Full worship band', 'High-energy'], ['Sunday 9:15 AM', 'Sunday 11:00 AM', 'Sunday 12:45 PM'], 'A broad, city-facing church with many ways to plug in, from early-career groups to practical care teams.', ['Biblical authority', 'Spiritual gifts', 'Missions', 'Small groups', 'Marriage and family'], ['Young adults', 'Families', 'College students', 'Small groups', 'Service opportunities', 'Social events'], ['Large monthly gatherings', 'Career-focused groups'], ['Marriage workshops', 'Family nights'], ['Missions', 'Evangelism', 'Young adults', 'Outreach', 'Spiritual growth'], ['Childcare', 'Children’s ministry', 'Parking', 'Accessibility', 'Online services', 'Multiple service times', 'Weekend groups', 'Events for young adults'], 'Validated garage parking on campus', 'Full children’s programming ages 0–12', 'Elevator, hearing loop, reserved seating', 'Full-service livestream', 'Church-provided', 'ochre'),
  seed('vineyard-indy', 'Vineyard Church', 'Vineyard', 'Near Eastside, Indianapolis', 11.7, 'Medium', ['Contemporary', 'Acoustic', 'Quiet / reflective'], ['Sunday 10:00 AM', 'Sunday 11:30 AM'], 'A fictional neighborhood Vineyard congregation with relaxed worship, room for questions, and a steady focus on prayer and serving nearby neighbors.', ['Biblical authority', 'Baptism', 'Communion', 'Spiritual gifts', 'Missions'], ['Young adults', 'Small groups', 'Bible studies', 'Service opportunities', 'Social events'], ['Monthly young adult dinner', 'Weeknight discussion group'], ['Couples supper club'], ['Local community service', 'Missions', 'Discipleship', 'Fellowship', 'Spiritual growth'], ['Parking', 'Childcare', 'Accessibility', 'Online services', 'Weekday groups', 'Volunteer opportunities', 'Coffee / social spaces'], 'Shared lot with nearby street parking', 'Children’s room during Sunday gatherings', 'Step-free main entry and accessible restrooms', 'Sunday message posted online', 'Church-provided', 'sage'),
  seed('grace-fellowship', 'Grace Fellowship', 'Methodist', 'Carmel', 18.6, 'Large', ['Blended', 'Choir', 'Quiet / reflective'], ['Sunday 8:30 AM', 'Sunday 10:00 AM', 'Sunday 11:30 AM'], 'A steady, intergenerational community with beautiful music, patient formation, and a generous care network.', ['Baptism', 'Communion', 'Worship practices', 'Marriage and family', 'Missions'], ['Families', 'Multi-generational', 'Women’s groups', 'Men’s groups', 'Bible studies', 'Service opportunities'], ['Young adult brunch once a month'], ['Marriage enrichment series'], ['Local community service', 'Missions', 'Discipleship', 'Family', 'Serving others'], ['Childcare', 'Children’s ministry', 'Parking', 'Accessibility', 'Online services', 'Multiple service times', 'Volunteer opportunities'], 'Ample surface parking by every entrance', 'Nursery and children’s rooms staffed', 'Fully accessible campus with elevator', 'Sunday services streamed', 'Platform verified', 'blue'),
  seed('cornerstone', 'Cornerstone Community', 'Presbyterian', 'Meridian-Kessler, Indianapolis', 10.3, 'Medium', ['Traditional', 'Blended', 'Choir'], ['Sunday 9:00 AM', 'Sunday 11:00 AM'], 'A thoughtful, rooted congregation pairing classic liturgy with warm hospitality and a very active local service life.', ['Biblical authority', 'Communion', 'Worship practices', 'Small groups', 'Missions'], ['Multi-generational', 'Young married couples', 'Bible studies', 'Marriage groups', 'Service opportunities'], ['Young adult study on Wednesdays'], ['Couples reading group', 'Quarterly retreats'], ['Local community service', 'Missions', 'Bible study', 'Social justice'], ['Childcare', 'Children’s ministry', 'Parking', 'Accessibility', 'Weekday groups', 'Volunteer opportunities'], 'Side lot and overflow street parking', 'Nursery during both Sunday services', 'Accessible entrance, restroom, and seating', 'Sermons available online', 'Church-provided', 'plum'),
  seed('st-andrews', 'St. Andrew’s', 'Anglican / Episcopal', 'Irvington, Indianapolis', 9.1, 'Small', ['Liturgical', 'Choir', 'Quiet / reflective'], ['Sunday 8:00 AM', 'Sunday 10:30 AM'], 'A small historic parish where liturgy, choral music, and shared service create a calm place to put down roots.', ['Baptism', 'Communion', 'Worship practices', 'Marriage and family', 'Small groups'], ['Multi-generational', 'Young married couples', 'Bible studies', 'Service opportunities'], ['Monthly young adult coffee'], ['Couples evening prayer'], ['Local community service', 'Missions', 'Fellowship', 'Spiritual growth'], ['Parking', 'Accessibility', 'Online services', 'Weekend groups', 'Volunteer opportunities'], 'Street parking and small rear lot', 'Family room available, not staffed', 'Accessible entrance at parish hall', 'Services recorded monthly', 'User reported', 'olive'),
  seed('hope-church', 'Hope Church', 'Pentecostal', 'Lawrence, Indianapolis', 14.7, 'Megachurch', ['Contemporary', 'Full worship band', 'High-energy'], ['Sunday 9:00 AM', 'Sunday 11:00 AM'], 'An energetic, service-minded congregation with room for big questions, big gatherings, and meaningful volunteer teams.', ['Spiritual gifts', 'Biblical authority', 'Baptism', 'Evangelism', 'Missions'], ['Young adults', 'Families', 'College students', 'Small groups', 'Social events'], ['Young adult nights', 'Interest-based groups'], ['Couples community'], ['Evangelism', 'Missions', 'Young adults', 'Outreach', 'Serving others'], ['Childcare', 'Children’s ministry', 'Student ministry', 'Parking', 'Accessibility', 'Online services', 'Multiple service times', 'Coffee / social spaces', 'Events for young adults'], 'Dedicated parking lots with volunteers', 'Children’s programming and sensory room', 'Accessible campus and ASL interpretation', 'High-quality livestream', 'Church-provided', 'coral'),
  seed('redeemer', 'Redeemer Community Church', 'Lutheran', 'Plainfield', 21.9, 'Medium', ['Traditional', 'Blended', 'Acoustic'], ['Sunday 9:00 AM', 'Sunday 10:45 AM'], 'A grounded community for people who appreciate a clear liturgy, familiar faces, and a low-pressure way to belong.', ['Baptism', 'Communion', 'Worship practices', 'Biblical authority', 'Small groups'], ['Families', 'Multi-generational', 'Young married couples', 'Bible studies', 'Service opportunities'], ['Quarterly young adult gatherings'], ['Couples breakfast circle'], ['Local community service', 'Missions', 'Family', 'Fellowship'], ['Childcare', 'Children’s ministry', 'Parking', 'Accessibility', 'Online services', 'Weekend groups', 'Volunteer opportunities'], 'Free lot with accessible spaces', 'Nursery available during 10:45 service', 'Accessible main entrance and sanctuary', 'Weekly sermon audio online', 'Platform verified', 'indigo'),
];

export const blankPreferences: Preferences = {
  city: 'Indianapolis',
  zip: '',
  travel: '15',
  profileType: 'individual',
  denomination: '',
  denominationImportance: 'matter',
  denominationMustHaves: [],
  language: '',
  languageImportance: 'matter',
  serviceTime: '',
  beliefs: Object.fromEntries(beliefOptions.map((item) => [item, 'matter'])),
  worship: ['Doesn’t matter'],
  worshipImportance: 'matter',
  community: Object.fromEntries(communityOptions.map((item) => [item, 'matter'])),
  size: 'No preference',
  mission: Object.fromEntries(missionOptions.map((item) => [item, 'matter'])),
  practical: Object.fromEntries(practicalOptions.map((item) => [item, 'matter'])),
  notes: '',
};

export function hasMatchingAnswers(prefs: Preferences) {
  const hasPriorityChoice = (choices: Record<string, Importance>) =>
    Object.values(choices).some((importance) => importance === 'must' || importance === 'prefer');
  return Boolean(
    (prefs.denomination && (prefs.denominationImportance === 'must' || prefs.denominationImportance === 'prefer')) ||
    prefs.denominationMustHaves?.length ||
    prefs.language ||
    prefs.serviceTime ||
    (prefs.worship.some((item) => item !== 'Doesn’t matter') && (prefs.worshipImportance === 'must' || prefs.worshipImportance === 'prefer')) ||
    hasPriorityChoice(prefs.beliefs) ||
    hasPriorityChoice(prefs.community) ||
    hasPriorityChoice(prefs.mission) ||
    hasPriorityChoice(prefs.practical) ||
    (prefs.size && prefs.size !== 'No preference') ||
    (prefs.travel && prefs.travel !== '15')
  );
}

export function getMustHaveLabels(prefs: Preferences) {
  const labels: string[] = [];
  if (prefs.denominationImportance === 'must' && prefs.denomination) labels.push(`${prefs.denomination} denomination`);
  (prefs.denominationMustHaves ?? []).forEach((item) => labels.push(`${item} denomination`));
  if (prefs.language && prefs.languageImportance === 'must') labels.push(`${prefs.language}-language service`);
  Object.entries(prefs.beliefs).forEach(([item, importance]) => { if (importance === 'must') labels.push(item); });
  Object.entries(prefs.community).forEach(([item, importance]) => { if (importance === 'must') labels.push(item); });
  Object.entries(prefs.mission).forEach(([item, importance]) => { if (importance === 'must') labels.push(`${item} mission`); });
  Object.entries(prefs.practical).forEach(([item, importance]) => { if (importance === 'must') labels.push(item); });
  if (prefs.worshipImportance === 'must') {
    prefs.worship.filter((item) => item !== 'Doesn’t matter').forEach((item) => labels.push(`${item} worship`));
  }
  return labels;
}

export function meetsMustHaves(church: Church, prefs: Preferences) {
  if (prefs.denominationImportance === 'must' && prefs.denomination && church.denomination !== prefs.denomination) return false;
  if ((prefs.denominationMustHaves ?? []).some((denomination) => church.denomination !== denomination)) return false;
  if (prefs.language && prefs.languageImportance === 'must' && !church.languages.includes(prefs.language)) return false;

  const hasEveryMustHave = (items: string[], choices: Record<string, Importance>) =>
    Object.entries(choices).every(([item, importance]) => importance !== 'must' || items.includes(item));

  if (!hasEveryMustHave(church.beliefs, prefs.beliefs)) return false;
  if (!hasEveryMustHave([...church.community, ...church.youngAdults, ...church.youngMarried], prefs.community)) return false;
  if (!hasEveryMustHave(church.mission, prefs.mission)) return false;
  if (!hasEveryMustHave(church.practical, prefs.practical)) return false;

  const requiredWorship = prefs.worship.filter((item) => item !== 'Doesn’t matter');
  if (prefs.worshipImportance === 'must' && requiredWorship.length && !requiredWorship.some((item) => church.worship.includes(item))) return false;

  return true;
}

export const noMustHaveMatchesMessage = 'No churches match all your must-haves. Try relaxing one.';

export function getChurchMatchState(churchList: Church[], prefs: Preferences, dismissed: string[] = []) {
  const eligibleChurches = churchList.filter((church) => meetsMustHaves(church, prefs));
  const matches = eligibleChurches
    .filter((church) => !dismissed.includes(church.id))
    .sort((a, b) => scoreChurch(b, prefs).score - scoreChurch(a, prefs).score);
  return {
    eligibleChurches,
    matches,
    emptyMessage: eligibleChurches.length ? null : getMustHaveLabels(prefs).length
      ? `No churches match all your must-haves (${getMustHaveLabels(prefs).join(', ')}). Try relaxing one.`
      : noMustHaveMatchesMessage,
  };
}

export function scoreChurch(church: Church, prefs: Preferences) {
  let earned = 0;
  let possible = 0;
  const matched: string[] = [];
  const differences: string[] = [];
  const importanceWeight = (value: Importance) => value === 'must' ? 2 : value === 'prefer' ? 1 : 0;
  if (prefs.denomination && importanceWeight(prefs.denominationImportance)) {
    const weight = importanceWeight(prefs.denominationImportance);
    possible += weight;
    if (church.denomination === prefs.denomination) {
      earned += weight;
      matched.push(`${church.denomination} tradition`);
    } else differences.push('Different tradition than your preference');
  }
  if (prefs.language) {
    const weight = Math.max(1, importanceWeight(prefs.languageImportance || 'prefer'));
    possible += weight;
    if (church.languages.includes(prefs.language)) {
      earned += weight;
      matched.push(`${prefs.language} services`);
    } else differences.push(`${prefs.language} services: Not listed`);
  }
  if (prefs.serviceTime) {
    possible += 1;
    const churchHasPreferredTime = church.serviceTimes.some((time) => {
      const match = time.match(/(\d{1,2})(?::\d{2})?\s*(AM|PM)/i);
      if (!match) return false;
      const hour = Number(match[1]);
      const period = match[2].toUpperCase();
      const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : period === 'AM' && hour === 12 ? 0 : hour;
      return prefs.serviceTime === 'Morning' ? hour24 >= 5 && hour24 < 12
        : prefs.serviceTime === 'Afternoon' ? hour24 >= 12 && hour24 < 17
          : hour24 >= 17 && hour24 < 24;
    });
    if (churchHasPreferredTime) {
      earned += 1;
      matched.push(`${prefs.serviceTime} services`);
    } else differences.push(`No ${prefs.serviceTime.toLowerCase()} service is listed`);
  }
  const compare = (items: string[], choices: Record<string, Importance>, label: string) => {
    let local = false;
    Object.entries(choices).forEach(([key, value]) => {
      const weight = importanceWeight(value);
      if (!weight) return;
      possible += weight;
      if (items.includes(key)) {
        earned += weight;
        local = true;
      } else differences.push(`${label}: ${key} is not listed`);
    });
    if (local) matched.push(label);
  };
  compare(church.beliefs, prefs.beliefs, 'Shared beliefs');
  compare([...church.community, ...church.youngAdults, ...church.youngMarried], prefs.community, 'Community priorities');
  compare(church.mission, prefs.mission, 'Mission priorities');
  compare(church.practical, prefs.practical, 'Practical fit');
  const selectedWorship = prefs.worship.filter((item) => item !== 'Doesn’t matter');
  const worshipWeight = selectedWorship.length ? importanceWeight(prefs.worshipImportance) : 0;
  if (worshipWeight) {
    possible += worshipWeight;
    if (selectedWorship.some((item) => church.worship.includes(item))) {
      earned += worshipWeight;
      matched.push('Worship style');
    } else differences.push('Worship style may feel different');
  }
  if (prefs.size && prefs.size !== 'No preference' && prefs.size === church.size) {
    possible += 1; earned += 1; matched.push(`${church.size} congregation`);
  } else if (prefs.size && prefs.size !== 'No preference') {
    possible += 1;
    differences.push(`You selected ${prefs.size.toLowerCase()}; this is ${church.size.toLowerCase()}`);
  }
  if (Number(prefs.travel)) {
    possible += 1;
    if (church.distance <= Number(prefs.travel)) {
      earned += 1;
      matched.push(`${church.distance} miles from ${prefs.city || 'you'}`);
    } else differences.push(`About ${church.distance} miles away`);
  }
  const score = possible ? Math.round((earned / possible) * 10000) / 100 : 50;
  return { score, matched: matched.slice(0, 4), differences: differences.slice(0, 3) };
}