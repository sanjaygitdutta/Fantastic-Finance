# Community Moderation & Features Implementation Plan

## Overview
Enhance the Community page with content moderation, notifications, and posting limits to ensure a safe and controlled environment.

## Features to Implement

### 1. **Content Moderation System**

#### Database Schema Updates
Add to Supabase `posts` table:
- `status` - 'pending' | 'approved' | 'rejected' | 'flagged'
- `flagged_reason` - Text field for moderation notes
- `reviewed_by` - Admin user ID who reviewed
- `reviewed_at` - Timestamp of review

#### Auto-Flagging System
Posts will be automatically flagged for admin review if they contain:
- Photo uploads (all images need approval)
- Flagged keywords (customizable list)
- External links
- User has been previously flagged

#### Admin Moderation Dashboard
- New section in AdminDashboard.tsx
- View pending posts queue
- Approve/Reject with one click
- Add moderation notes
- View user posting history

### 2. **Post Limit System (3 posts/day)**

#### Implementation
- Track posts in `localStorage` and Supabase
- Check post count before allowing submission
- Show remaining posts counter in UI
- Reset daily at 00:00 local time

#### UI Updates
- Display: "You have 2/3 posts remaining today"
- Disable post button when limit reached
- Show countdown to reset time

### 3. **Notifications System**

#### Database Schema
New `notifications` table:
```sql
- id (uuid)
- user_id (uuid) - recipient
- type ('like' | 'comment' | 'share' | 'follow')
- post_id (uuid) - related post
- from_user_id (uuid) - who triggered it
- read (boolean)
- created_at (timestamp)
```

#### Notification Types
- 🩵 Like: "John liked your post"
- 💬 Comment: "Sarah commented on your post"
- 🔁 Share: "Mike shared your post"
- 👤 Follow: "Alice started following you"

#### UI Components
- Bell icon with unread count badge in header
- Dropdown notification panel
- Real-time updates using Supabase subscriptions
- Mark as read functionality

### 4. **Display & Privacy**

#### Post Visibility
- All posts are **public** by default
- Visible to all logged-in users
- Non-logged users can view but not interact

#### User Profiles
- Public profile pages
- Show user's approved posts
- Follower/Following count
- Join date, bio

## Implementation Steps

### Phase 1: Database Setup (30 min)
1. Update `posts` table schema
2. Create `notifications` table
3. Create `post_limits` tracking table
4. Set up database policies

### Phase 2: Content Moderation (2 hours)
1. Add auto-flagging logic to post creation
2. Create admin moderation dashboard
3. Implement approve/reject workflow
4. Add flagged content filters

### Phase 3: Post Limits (1 hour)
1. Create post tracking system
2. Add validation before post creation
3. Update UI with remaining posts
4. Implement daily reset logic

### Phase 4: Notifications (2 hours)
1. Create notification backend functions
2. Build notification UI component
3. Add real-time subscriptions
4. Implement mark as read

### Phase 5: Testing & Polish (1 hour)
1. Test all moderation flows
2. Verify post limits work correctly
3. Test notification delivery
4. Polish UI/UX

## Total Estimated Time: 6-7 hours

## Database Migrations Needed

```sql
-- 1. Update posts table
ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'approved';
ALTER TABLE posts ADD COLUMN flagged_reason TEXT;
ALTER TABLE posts ADD COLUMN reviewed_by UUID;
ALTER TABLE posts ADD COLUMN reviewed_at TIMESTAMP;

-- 2. Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create post limits tracking
CREATE TABLE user_post_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_date DATE DEFAULT CURRENT_DATE,
  post_count INTEGER DEFAULT 0,
  UNIQUE(user_id, post_date)
);
```

## Files to Modify

### New Files
- `src/components/NotificationPanel.tsx` - Notification dropdown UI
- `src/components/AdminModeration.tsx` - Moderation dashboard
- `src/lib/contentModeration.ts` - Auto-flagging logic
- `src/lib/notifications.ts` - Notification helpers

### Modified Files
- `src/components/Community.tsx` - Add post limit checks
- `src/components/AdminDashboard.tsx` - Add moderation tab
- `src/components/Layout.tsx` - Add notification bell
- `src/lib/supabase.ts` - Add notification subscriptions

## Content Flagging Keywords (Examples)
- Adult content keywords
- Spam indicators
- Offensive language
- Scam/phishing terms
- Violence-related terms

*List can be customized via admin dashboard*

## User Experience Flow

### Posting Content
1. User creates post with image
2. System auto-flags for review
3. User sees: "Your post is pending admin approval"
4. Admin reviews and approves
5. Post becomes visible to everyone
6. User gets notification: "Your post was approved!"

### Receiving Notifications
1. User's post gets liked
2. Notification created in database
3. Bell icon shows red dot
4. User clicks bell → sees "John liked your post"
5. Click notification → goes to post
6. Notification marked as read

### Hitting Post Limit
1. User tries to create 4th post
2. System shows: "Daily limit reached (3/3)"
3. Display: "Reset in 5 hours 23 minutes"
4. Post button disabled until reset

## Security Considerations

- ✅ Admin-only access to moderation dashboard
- ✅ Rate limiting on notification creation
- ✅ SQL injection prevention
- ✅ XSS protection in post content
- ✅ Image upload size limits
- ✅ CAPTCHA for repeated flagged users

## Success Metrics

- < 1 hour average moderation response time
- 99% of inappropriate content flagged
- < 5% false positive flagging
- Real-time notification delivery
- Zero post limit bypasses
