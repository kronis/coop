export type MastodonStatus = {
  id: string;
  uri: string;
  url: string | null;
  account: MastodonAccount; // you would need a separate type for account
  in_reply_to_id: string | null;
  in_reply_to_account_id: string | null;
  reblog: MastodonStatus | null; // for reblogs
  content: string;
  created_at: string; // ISO 8601 datetime string
  emojis: MastodonEmoji[];
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  reblogged: boolean | null;
  favourited: boolean | null;
  muted: boolean | null;
  sensitive: boolean;
  spoiler_text: string;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  media_attachments: MastodonMediaAttachment[];
  mentions: MastodonMention[];
  tags: MastodonTag[];
  application: MastodonApplication | null;
  language: string | null;
  pinned: boolean | null;
  bookmarked: boolean | null;
  poll: MastodonPoll | null;
  card: MastodonCard | null;
  filtered: MastodonFiltered[] | null;
};

// Define supporting types based on documentation

type MastodonAccount = {
  id: string;
  username: string;
  acct: string;
  display_name: string;
  locked: boolean;
  bot: boolean;
  discoverable: boolean | null;
  group: boolean;
  created_at: string;
  note: string;
  url: string;
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  emojis: MastodonEmoji[];
  fields: MastodonField[];
};

type MastodonField = {
  name: string;
  value: string;
  verified_at: string | null;
};

type MastodonEmoji = {
  shortcode: string;
  url: string;
  static_url: string;
  visible_in_picker: boolean;
};

type MastodonMediaAttachment = {
  id: string;
  type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown';
  url: string;
  preview_url: string;
  remote_url: string | null;
  text_url: string | null;
  meta: object | null;
  description: string | null;
  blurhash: string | null;
};

type MastodonMention = {
  id: string;
  username: string;
  url: string;
  acct: string;
};

type MastodonTag = {
  name: string;
  url: string;
};

type MastodonApplication = {
  name: string;
  website: string | null;
};

type MastodonPoll = {
  id: string;
  expires_at: string | null;
  expired: boolean;
  multiple: boolean;
  votes_count: number;
  voters_count: number | null;
  options: MastodonPollOption[];
  emojis: MastodonEmoji[];
  voted: boolean | null;
  own_votes: number[] | null;
};

type MastodonPollOption = {
  title: string;
  votes_count: number;
};

type MastodonCard = {
  url: string;
  title: string;
  description: string;
  type: string;
  author_name: string | null;
  author_url: string | null;
  provider_name: string | null;
  provider_url: string | null;
  html: string | null;
  width: number | null;
  height: number | null;
  image: string | null;
  embed_url: string | null;
  blurhash: string | null;
};

type MastodonFiltered = {
  filter: MastodonFilter;
  keyword_matches: string[] | null;
  status_matches: string[] | null;
};

type MastodonFilter = {
  id: string;
  phrase: string;
  context: string[];
  expires_at: string | null;
  irreversible: boolean;
  whole_word: boolean;
};
