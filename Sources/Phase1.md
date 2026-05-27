Yes. Phase 1 is where you create the visible foundation of your product. At the end, you should have a working website with:

- A home page at `/`

- A login page at `/login`

- A sign-up page at `/signup`

- A dashboard page at `/dashboard`

- A shared dashboard header and responsive sidebar

- No database, authentication or Google Calendar connection yet

As of \*\*May 27, 2026\*\*, current Next.js requires \*\*Node.js 20.9 or later\*\*. Current Tailwind setup uses Tailwind CSS v4, so it is normal if your project does \*\*not\*\* have a `tailwind.config.ts` file.

## Step 0: Check Your Setup

Open a terminal in VS Code:

- Menu: `Terminal` -> `New Terminal`

- Or press `` Ctrl + ` ``

Run:

```bash

node -v

npm -v

```

Your Node result should be at least:

```text

v20.9.0

```

If your version is older, install the current Node.js LTS version from [nodejs.org](https://nodejs.org/).

If you already created your Next.js project and can see a `package.json` file, skip to \*\*Step 2\*\*.

---

# Step 1: Create The Next.js Project

Choose a location where you want the project folder. In the terminal, run:

```bash

npx create-next-app@latest syncday --typescript --tailwind --eslint --app --src-dir --use-npm

```

`syncday` is the temporary product name. You can change it, for example:

```bash

npx create-next-app@latest calendar-sync --typescript --tailwind --eslint --app --src-dir --use-npm

```

If you are asked questions during setup, choose:

| Question | Choice |

|---|---|

| Would you like to use React Compiler? | `No` for now |

| Would you like to customize the import alias? | `No` |

| Import alias | Keep `@/\*` |

Now enter the project folder:

```bash

cd syncday

```

Start your development website:

```bash

npm run dev

```

Open this address in your browser:

```text

http://localhost:3000

```

You should see the default Next.js starter page.

## What Just Happened?

Your folder now contains something similar to:

```text

syncday/

├─ public/

├─ src/

│ └─ app/

│ ├─ favicon.ico

│ ├─ globals.css

│ ├─ layout.tsx

│ └─ page.tsx

├─ eslint.config.mjs

├─ next.config.ts

├─ package.json

├─ postcss.config.mjs

└─ tsconfig.json

```

Important files:

| File | Purpose |

|---|---|

| `src/app/page.tsx` | Your landing page at `/` |

| `src/app/layout.tsx` | Shared outer HTML layout for all pages |

| `src/app/globals.css` | Global styles and Tailwind import |

| `public/` | Images and icons |

| `package.json` | Installed dependencies and scripts |

---

# Step 2: Open The Project In VS Code

From inside your project folder, run:

```bash

code .

```

In the VS Code left sidebar, expand:

```text

src

└─ app

```

You will edit files inside this folder.

Keep the development server running in the terminal:

```bash

npm run dev

```

Whenever you modify a file, the browser should update automatically.

---

# Step 3: Decide The Phase 1 Folder Structure

By the end of Phase 1, create this structure:

```text

src/

├─ app/

│ ├─ globals.css

│ ├─ layout.tsx

│ ├─ page.tsx

│ │

│ ├─ login/

│ │ └─ page.tsx

│ │

│ ├─ signup/

│ │ └─ page.tsx

│ │

│ └─ dashboard/

│ ├─ layout.tsx

│ └─ page.tsx

│

└─ components/

├─ site-header.tsx

└─ dashboard/

├─ dashboard-sidebar.tsx

└─ dashboard-topbar.tsx

```

In Next.js App Router, folders create URLs:

| File | Website URL |

|---|---|

| `src/app/page.tsx` | `/` |

| `src/app/login/page.tsx` | `/login` |

| `src/app/signup/page.tsx` | `/signup` |

| `src/app/dashboard/page.tsx` | `/dashboard` |

---

# Step 4: Set Up Global Styles

Open:

```text

src/app/globals.css

```

Replace its content with:

```css

@import "tailwindcss";

:root {

--background: #f8fafc;

--foreground: #0f172a;

}

\* {

box-sizing: border-box;

}

html {

scroll-behavior: smooth;

}

body {

margin: 0;

background: var(--background);

color: var(--foreground);

font-family: Arial, Helvetica, sans-serif;

}

button,

input {

font: inherit;

}

```

The most important line is:

```css

@import "tailwindcss";

```

That activates Tailwind styling throughout your application.

---

# Step 5: Configure The Root Layout

Open:

```text

src/app/layout.tsx

```

Replace its content with:

```tsx

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {

title: "SyncDay | Simple Calendar Sync",

description: "Plan your schedule and sync events to Google Calendar.",

};

export default function RootLayout({

children,

}: Readonly<{

children: React.ReactNode;

}>) {

return (

<html lang="en">

<body>{children}</body>

</html>

);

}

```

This layout wraps every page in your website.

For example:

```text

/

/login

/signup

/dashboard

```

All of them receive the global CSS and metadata from this file.

---

# Step 6: Create The Website Header

Create this folder if it does not exist:

```text

src/components

```

Create this file:

```text

src/components/site-header.tsx

```

Add:

```tsx

import Link from "next/link";

export function SiteHeader() {

return (

<header className="border-b border-slate-200 bg-white">

<nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

<Link href="/" className="flex items-center gap-2 text-xl font-semibold text-slate-900">

<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">

S

</span>

SyncDay

</Link>

<div className="flex items-center gap-4">

<Link

href="/login"

className="text-sm font-medium text-slate-600 transition hover:text-slate-900"

>

Log in

</Link>

<Link

href="/signup"

className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"

>

Get started

</Link>

</div>

</nav>

</header>

);

}

```

This is a reusable header. You will display it on the landing page.

---

# Step 7: Build The Landing Page

Open:

```text

src/app/page.tsx

```

Replace its content with:

```tsx

import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

const benefits = [

{

title: "Create events easily",

description: "Plan classes, work, meetings and deadlines in a clean calendar interface.",

},

{

title: "Connect Google Calendar",

description: "Securely connect your Google account when you are ready to sync.",

},

{

title: "Sync with one click",

description: "Send your planned events into a dedicated calendar visible on every device.",

},

];

export default function HomePage() {

return (

<div className="min-h-screen bg-white">

<SiteHeader />

<main>

<section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">

<div>

<p className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">

Simple planning with Google Calendar sync

</p>

<h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">

Plan your day. Sync it everywhere.

</h1>

<p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">

SyncDay helps you create events in a simple planner and send

them to Google Calendar with one click.

</p>

<div className="mt-8 flex flex-wrap gap-4">

<Link

href="/signup"

className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"

>

Start free

</Link>

<Link

href="/dashboard"

className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"

>

View dashboard

</Link>

</div>

</div>

<div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-200/50">

<div className="rounded-2xl bg-white p-5">

<div className="mb-6 flex items-center justify-between">

<div>

<p className="text-sm text-slate-500">May 2026</p>

<h2 className="text-lg font-semibold text-slate-900">My Schedule</h2>

</div>

<span className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">

Sync Now

</span>

</div>

<div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-400">

{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (

<span key={day}>{day}</span>

))}

</div>

<div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm text-slate-700">

{Array.from({ length: 31 }, (\_, index) => {

const day = index + 1;

return (

<div

key={day}

className={`min-h-14 rounded-lg p-2 ${

day === 27 ? "bg-blue-600 text-white" : "bg-slate-50"

}`}

>

{day}

</div>

);

})}

</div>

<div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">

Product planning meeting - Today at 4:00 PM

</div>

</div>

</div>

</section>

<section className="border-y border-slate-100 bg-slate-50">

<div className="mx-auto max-w-7xl px-6 py-16">

<div className="mb-10 max-w-xl">

<h2 className="text-3xl font-bold text-slate-900">

Three steps to an organized calendar

</h2>

</div>

<div className="grid gap-6 md:grid-cols-3">

{benefits.map((benefit, index) => (

<article

key={benefit.title}

className="rounded-2xl border border-slate-200 bg-white p-6"

>

<span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">

{index + 1}

</span>

<h3 className="text-lg font-semibold text-slate-900">

{benefit.title}

</h3>

<p className="mt-2 leading-7 text-slate-600">

{benefit.description}

</p>

</article>

))}

</div>

</div>

</section>

</main>

<footer className="bg-white">

<div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">

<p>SyncDay. Simple calendar planning.</p>

<div className="flex gap-5">

<Link href="/login">Log in</Link>

<Link href="/signup">Sign up</Link>

</div>

</div>

</footer>

</div>

);

}

```

Check your browser at:

```text

http://localhost:3000

```

You should now have a landing page instead of the Next.js starter screen.

---

# Step 8: Build The Login Screen

Create the folder:

```text

src/app/login

```

Create:

```text

src/app/login/page.tsx

```

Add:

```tsx

import Link from "next/link";

export default function LoginPage() {

return (

<main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">

<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

<Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-semibold">

<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">

S

</span>

SyncDay

</Link>

<h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>

<p className="mt-2 text-sm text-slate-600">

Log in to manage your calendar events.

</p>

<form className="mt-8 space-y-5">

<div>

<label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">

Email

</label>

<input

id="email"

type="email"

placeholder="you@example.com"

className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

/>

</div>

<div>

<label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">

Password

</label>

<input

id="password"

type="password"

placeholder="Enter your password"

className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

/>

</div>

<button

type="button"

className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"

>

Log in

</button>

</form>

<p className="mt-6 text-center text-sm text-slate-600">

Do not have an account?{" "}

<Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700">

Sign up

</Link>

</p>

</div>

</main>

);

}

```

For Phase 1, the form button does not actually log anyone in yet. That comes in Phase 2 with Supabase authentication.

Test it at:

```text

http://localhost:3000/login

```

---

# Step 9: Build The Sign-Up Screen

Create:

```text

src/app/signup/page.tsx

```

Add:

```tsx

import Link from "next/link";

export default function SignupPage() {

return (

<main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">

<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

<Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-semibold">

<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">

S

</span>

SyncDay

</Link>

<h1 className="text-2xl font-bold text-slate-900">Create your account</h1>

<p className="mt-2 text-sm text-slate-600">

Start building your personal schedule for free.

</p>

<form className="mt-8 space-y-5">

<div>

<label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">

Name

</label>

<input

id="name"

type="text"

placeholder="Your name"

className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

/>

</div>

<div>

<label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">

Email

</label>

<input

id="email"

type="email"

placeholder="you@example.com"

className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

/>

</div>

<div>

<label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">

Password

</label>

<input

id="password"

type="password"

placeholder="Create a password"

className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

/>

</div>

<button

type="button"

className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"

>

Create account

</button>

</form>

<p className="mt-6 text-center text-sm text-slate-600">

Already have an account?{" "}

<Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">

Log in

</Link>

</p>

</div>

</main>

);

}

```

Test it at:

```text

http://localhost:3000/signup

```

---

# Step 10: Create Dashboard Components

Create the folder:

```text

src/components/dashboard

```

## Dashboard Sidebar

Create:

```text

src/components/dashboard/dashboard-sidebar.tsx

```

Add:

```tsx

import Link from "next/link";

const menuItems = [

{ label: "Calendar", href: "/dashboard" },

{ label: "Integrations", href: "/dashboard" },

{ label: "Sync History", href: "/dashboard" },

{ label: "Settings", href: "/dashboard" },

];

export function DashboardSidebar() {

return (

<aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">

<div className="border-b border-slate-200 px-6 py-5">

<Link href="/" className="flex items-center gap-2 text-xl font-semibold">

<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">

S

</span>

SyncDay

</Link>

</div>

<div className="px-4 py-6">

<button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left font-medium text-white transition hover:bg-blue-700">

+ Create event

</button>

</div>

<nav className="space-y-1 px-4">

{menuItems.map((item, index) => (

<Link

key={item.label}

href={item.href}

className={`block rounded-lg px-4 py-3 text-sm font-medium ${

index === 0

? "bg-blue-50 text-blue-700"

: "text-slate-600 hover:bg-slate-50 hover:text-slate-900"

}`}

>

{item.label}

</Link>

))}

</nav>

<div className="mx-4 mt-auto mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

<p className="text-sm font-medium text-slate-900">Google Calendar</p>

<p className="mt-1 text-sm text-slate-500">Not connected</p>

<button className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">

Connect

</button>

</div>

</aside>

);

}

```

During Phase 1, the menu links may all temporarily point to `/dashboard`. You will make the real pages later.

## Dashboard Top Bar

Create:

```text

src/components/dashboard/dashboard-topbar.tsx

```

Add:

```tsx

import Link from "next/link";

export function DashboardTopbar() {

return (

<header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">

<div className="flex items-center gap-3 md:hidden">

<Link href="/" className="flex items-center gap-2 font-semibold">

<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">

S

</span>

SyncDay

</Link>

</div>

<div className="hidden md:block">

<input

type="search"

placeholder="Search events..."

className="w-72 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-blue-500"

/>

</div>

<div className="ml-auto flex items-center gap-3">

<button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">

Sync Now

</button>

<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">

K

</div>

</div>

</header>

);

}

```

---

# Step 11: Create Dashboard Shared Layout

Create the folder:

```text

src/app/dashboard

```

Create:

```text

src/app/dashboard/layout.tsx

```

Add:

```tsx

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

export default function DashboardLayout({

children,

}: Readonly<{

children: React.ReactNode;

}>) {

return (

<div className="flex min-h-screen bg-slate-50">

<DashboardSidebar />

<div className="flex min-w-0 flex-1 flex-col">

<DashboardTopbar />

{children}

</div>

</div>

);

}

```

This is different from your root layout:

| Layout | Applies To |

|---|---|

| `src/app/layout.tsx` | Entire website |

| `src/app/dashboard/layout.tsx` | Dashboard pages only |

Later, if you create:

```text

src/app/dashboard/settings/page.tsx

src/app/dashboard/integrations/page.tsx

```

they will automatically use the same sidebar and topbar.

---

# Step 12: Build The Empty Dashboard Page

Create:

```text

src/app/dashboard/page.tsx

```

Add:

```tsx

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dates = [

"", "", "", "1", "2", "3", "4",

"5", "6", "7", "8", "9", "10", "11",

"12", "13", "14", "15", "16", "17", "18",

"19", "20", "21", "22", "23", "24", "25",

"26", "27", "28", "29", "30", "31", "",

];

export default function DashboardPage() {

return (

<main className="flex-1 p-4 sm:p-6">

<section className="rounded-2xl border border-slate-200 bg-white">

<div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">

<div>

<h1 className="text-2xl font-bold text-slate-900">May 2026</h1>

<p className="mt-1 text-sm text-slate-500">

Your personal planning calendar

</p>

</div>

<div className="flex items-center gap-2">

<button className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">

Today

</button>

<div className="flex rounded-lg border border-slate-300 p-1 text-sm">

<button className="rounded-md bg-blue-600 px-3 py-2 text-white">

Month

</button>

<button className="px-3 py-2 text-slate-600">Week</button>

<button className="px-3 py-2 text-slate-600">Day</button>

</div>

</div>

</div>

<div className="overflow-x-auto p-3 sm:p-5">

<div className="min-w-[700px]">

<div className="grid grid-cols-7">

{days.map((day) => (

<div

key={day}

className="border-b border-slate-200 py-3 text-center text-sm font-medium text-slate-500"

>

{day}

</div>

))}

</div>

<div className="grid grid-cols-7">

{dates.map((date, index) => (

<div

key={`${date}-${index}`}

className="min-h-28 border-b border-r border-slate-100 p-2"

>

{date && (

<>

<span

className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${

date === "27"

? "bg-blue-600 font-medium text-white"

: "text-slate-700"

}`}

>

{date}

</span>

{date === "27" && (

<div className="mt-2 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">

Design meeting

</div>

)}

</>

)}

</div>

))}

</div>

</div>

</div>

</section>

</main>

);

}

```

Test it at:

```text

http://localhost:3000/dashboard

```

This is a static calendar preview. In Phase 3, you will replace it with a real calendar component where users can add and edit events.

---

# Step 13: Understand Responsive Sidebar Behavior

In the sidebar file, this line controls desktop visibility:

```tsx

<aside className="hidden ... md:flex md:flex-col">

```

It means:

| Screen Size | Sidebar Behavior |

|---|---|

| Mobile phone | Hidden |

| Tablet/desktop | Visible |

For the first Phase 1 version, hiding the sidebar on mobile is enough. Later, you can add a hamburger menu that opens the sidebar in a drawer.

To check mobile appearance:

1. Open your app in Chrome.

2. Press `F12`.

3. Click the phone/tablet icon.

4. Select a phone size.

5. Visit `/dashboard`.

---

# Step 14: UI Components Decision

In the earlier roadmap, I mentioned installing UI components. You have two practical choices.

## Choice A: Use Plain Tailwind First

The code above uses Tailwind directly for:

- Buttons

- Inputs

- Cards

- Sidebar links

This is the simplest route for Phase 1 and is completely fine.

## Choice B: Add shadcn/ui

`shadcn/ui` gives you polished reusable components such as buttons, dialogs, sheets and inputs. It is useful later when you build the event modal and mobile sidebar.

To add it inside your project folder:

```bash

npx shadcn@latest init

```

Then install useful components:

```bash

npx shadcn@latest add button input card dialog sheet badge

```

For now, I recommend completing the pages with plain Tailwind first. Add `shadcn/ui` when you begin the event modal or mobile navigation, because then its components immediately solve a real problem.

---

# Step 15: Your Phase 1 Final File Tree

At the end, your project should look like:

```text

syncday/

├─ public/

├─ src/

│ ├─ app/

│ │ ├─ globals.css

│ │ ├─ layout.tsx

│ │ ├─ page.tsx

│ │ ├─ login/

│ │ │ └─ page.tsx

│ │ ├─ signup/

│ │ │ └─ page.tsx

│ │ └─ dashboard/

│ │ ├─ layout.tsx

│ │ └─ page.tsx

│ │

│ └─ components/

│ ├─ site-header.tsx

│ └─ dashboard/

│ ├─ dashboard-sidebar.tsx

│ └─ dashboard-topbar.tsx

│

├─ package.json

├─ postcss.config.mjs

├─ next.config.ts

└─ tsconfig.json

```

---

# Step 16: Test Everything

With your development server running:

```bash

npm run dev

```

Visit these URLs:

| URL | What You Should See |

|---|---|

| `http://localhost:3000` | Landing page |

| `http://localhost:3000/login` | Login form |

| `http://localhost:3000/signup` | Sign-up form |

| `http://localhost:3000/dashboard` | Calendar dashboard shell |

Click through the buttons:

- Logo should lead to `/`.

- `Log in` should lead to `/login`.

- `Get started` should lead to `/signup`.

- `View dashboard` should lead to `/dashboard`.

Then stop the development server by pressing:

```text

Ctrl + C

```

Run a production build check:

```bash

npm run build

```

If it completes successfully, your Phase 1 foundation is properly built.

---

# Step 17: What Is And Is Not Finished

## Finished At The End Of Phase 1

- Website project setup.

- Styling system.

- Landing page.

- Login screen design.

- Sign-up screen design.

- Dashboard design.

- Navigation links.

- Responsive starting layout.

## Not Finished Yet

These are later phases:

- Real user sign-up.

- Real login.

- Saving events.

- Opening event creation modal.

- Real month/week/day switching.

- Connecting Google Calendar.

- Sync button functionality.

At this stage, buttons such as `Create account`, `Sync Now` and `Connect` are visual only. That is expected.

## Next Phase

Phase 2 will turn the login and sign-up forms into real accounts using Supabase Auth, and protect `/dashboard` so only logged-in users can enter it.

## Sources

- [Next.js installation documentation](https://nextjs.org/docs/app/getting-started/installation)

- [Next.js layouts and pages documentation](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

- [Next.js Tailwind CSS documentation](https://nextjs.org/docs/app/guides/tailwind-css)

- [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next)