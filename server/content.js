// All site copy lives here; the React app fetches it from /api/content.
// Text wrapped in *asterisks* is rendered in the italic serif accent font.
export const content = {
  name: 'Anunay',
  role: 'Software engineer',
  email: 'anunaynalam@gmail.com',
  tagline:
    'Writes code by day. Moves pawns, shuttlecocks and *dinks* the rest of the time. Now filming all of it.',
  ticker: ['Chess 1900+', 'Badminton', 'Cricket', 'Pickleball', 'Travel', 'Stock research'],
  about: {
    label: 'quick bio',
    text: "Hi I'm Anunay. I'm *very* competitive about things that don't pay the bills — and I'd love for you to join in.",
  },
  obsessions: [
    { id: 'chess', title: 'Chess', emoji: '♟️', color: 'yellow', badge: '1900+ on chess.com', body: 'Yes, I will absolutely think for 6 minutes about a move and then blunder the queen. Send a challenge.' },
    { id: 'badminton', title: 'Badminton', emoji: '🏸', color: 'blue', body: 'Fast hands, loud smashes, zero chill. Doubles partner wanted. Must enjoy long rallies.' },
    { id: 'cricket', title: 'Cricket', emoji: '🏏', color: 'orange', body: "Will talk about last night's match for an hour. Will also bat, bowl, or stand in the outfield wishing." },
    { id: 'pickleball', title: 'Pickleball', emoji: '🥒', color: 'green', body: "It's not ping pong, it's not tennis, it's the thing everyone's addicted to and I'm no exception." },
    { id: 'travel', title: 'Travel', emoji: '✈️', color: 'purple', body: 'Always one booking away from a new city. Good food, bad maps, great stories.' },
    { id: 'stocks', title: 'Stock research', emoji: '📊', color: 'pink', body: 'Reading annual reports for fun (yes, really). Happy to nerd out about businesses. Not financial advice.' },
  ],
  camera: {
    title: 'Now on *camera*',
    text: 'Games, courts, trips and stock chats — all on my channels. Come say hi and subscribe!',
    channels: [
      { name: 'YouTube', emoji: '▶️', color: 'orange', cta: 'Subscribe →', url: 'https://youtube.com/', body: 'Long videos: chess games, travel diaries, market deep-dives.' },
      { name: 'Instagram', emoji: '📸', color: 'pink', cta: 'Follow →', url: 'https://instagram.com/', body: 'Short reels: courts, matches, trips and everyday chaos.' },
    ],
  },
  play: [
    { label: 'Badminton', emoji: '🏸', color: 'blue' },
    { label: 'Chess', emoji: '♟️', color: 'yellow' },
    { label: 'Cricket', emoji: '🏏', color: 'orange' },
    { label: 'Pickleball', emoji: '🥒', color: 'green' },
    { label: 'Travel', emoji: '✈️', color: 'purple' },
    { label: 'Stocks', emoji: '📈', color: 'pink' },
    { label: 'Collab', emoji: '🤝', color: 'white' },
  ],
  links: [
    { label: 'LinkedIn', emoji: '💼', color: 'blue', url: 'https://linkedin.com/' },
    { label: 'Instagram', emoji: '📸', color: 'pink', url: 'https://instagram.com/' },
    { label: 'YouTube', emoji: '▶️', color: 'orange', url: 'https://youtube.com/' },
    { label: 'Chess.com', emoji: '♟️', color: 'green', url: 'https://chess.com/' },
  ],
};
