# Supabase Setup

Complete guide to setting up Supabase for authentication and database.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:

- **Authentication**: Email/password, magic links, OAuth
- **Database**: PostgreSQL database with real-time subscriptions
- **Storage**: File storage
- **Edge Functions**: Serverless functions

## Quick Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name
   - Database password (save this!)
   - Region (choose closest to your users)
5. Wait 2 minutes for project to be created

### 2. Get API Credentials

1. Go to **Settings** > **API**
2. Copy two values:
   - **Project URL**
   - **anon/public key**
3. Add to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Restart Dev Server

```bash
npx expo start --clear
```

## Database Setup

### Create Profiles Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Allow users to read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call function when user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Using Authentication

The starter includes a complete auth hook at [lib/hooks/useAuth.ts](../lib/hooks/useAuth.ts).

### Sign Up

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

export default function SignUpScreen() {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      // User created! Check email for confirmation
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable onPress={handleSignUp}>
        <Text>Sign Up</Text>
      </Pressable>
    </View>
  );
}
```

### Sign In

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

export default function SignInScreen() {
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      // User signed in!
    } catch (error) {
      alert(error.message);
    }
  };

  // ... rest of component
}
```

### Check Auth State

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

export default function HomeScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return <Text>Welcome {user.email}!</Text>;
}
```

### Sign Out

```tsx
const { signOut } = useAuth();

<Pressable onPress={signOut}>
  <Text>Sign Out</Text>
</Pressable>;
```

### Password Reset

```tsx
const { resetPassword } = useAuth();

const handleReset = async () => {
  try {
    await resetPassword(email);
    alert('Check your email for reset link');
  } catch (error) {
    alert(error.message);
  }
};
```

## Using Database

The starter includes React Query hooks at [lib/hooks/useData.ts](../lib/hooks/useData.ts).

### Fetch User Profile

```tsx
import { useProfile } from '@/lib/hooks/useData';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useProfile(user?.id);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>{profile.full_name}</Text>
      <Text>{profile.email}</Text>
    </View>
  );
}
```

### Update Profile

```tsx
import { useUpdateProfile } from '@/lib/hooks/useData';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        full_name: 'John Doe',
        avatar_url: 'https://...',
      });
      alert('Profile updated!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    // ... your form
  );
}
```

## Email Configuration

### Enable Email Confirmation (Recommended)

1. Go to **Authentication** > **Settings**
2. Enable "Enable email confirmations"
3. Users will receive a confirmation email after signup

### Customize Email Templates

1. Go to **Authentication** > **Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### Set Up Custom Domain (Production)

1. Go to **Project Settings** > **Auth**
2. Add your custom domain
3. Update DNS records as shown

## Row Level Security (RLS)

**ALWAYS enable RLS** on your tables. This ensures users can only access their own data.

### Example: Items Table

```sql
-- Create table
create table items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table items enable row level security;

-- Users can only see their own items
create policy "Users can view own items"
  on items for select
  using (auth.uid() = user_id);

-- Users can only insert items for themselves
create policy "Users can create own items"
  on items for insert
  with check (auth.uid() = user_id);

-- Users can only update their own items
create policy "Users can update own items"
  on items for update
  using (auth.uid() = user_id);

-- Users can only delete their own items
create policy "Users can delete own items"
  on items for delete
  using (auth.uid() = user_id);
```

## Real-time Subscriptions

Subscribe to database changes:

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function RealtimeItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Subscribe to inserts
    const subscription = supabase
      .channel('items')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'items'
      }, (payload) => {
        setItems(current => [...current, payload.new]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    // ... render items
  );
}
```

## Storage

Upload files to Supabase Storage:

```tsx
import { supabase } from '@/lib/supabase/client';
import * as ImagePicker from 'expo-image-picker';

const uploadAvatar = async () => {
  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return;

  // Create FormData
  const formData = new FormData();
  formData.append('file', {
    uri: result.assets[0].uri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  });

  // Upload to Supabase
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${user.id}/avatar.jpg`, formData, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(data.path);

  return publicUrl;
};
```

## Security Best Practices

1. **Always use RLS**: Never trust the client
2. **Validate on server**: Use database constraints and triggers
3. **Use service role carefully**: Only in Edge Functions, never in client
4. **Rotate keys**: If anon key is exposed, regenerate it
5. **Enable MFA**: For admin accounts

## Common Issues

### "Invalid API key"

- Check `.env` file has correct values
- Restart dev server after changing `.env`
- Ensure variables start with `EXPO_PUBLIC_`

### "Row Level Security policy violation"

- Make sure RLS policies are created
- Check `auth.uid()` matches expected user

### "Email not confirmed"

- Check email for confirmation link
- Or disable email confirmation in auth settings

## Next Steps

- Read [State Management](./08-state-management.md) to integrate with React Query
- Check [API Reference](./15-api-reference.md) for available hooks
