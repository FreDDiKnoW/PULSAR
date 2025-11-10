# PULSAR — The Virtual Astrophysics Club

> Explore the universe. Connect with explorers. Learn from the stars.

---

## Overview

**CosmoLink** is an interactive web platform designed for astronomy and space enthusiasts.  
It combines **real space data**, **community engagement**, and **AI-powered learning** to make space exploration accessible, fun, and educational.

Users can:
- Explore live space events (NASA, SpaceX, asteroids, and more)
- Build personal interactive **star maps**
- Participate in **space discussions and quizzes**
- Earn **ranks and achievements** as they learn and explore

---

## Key Features

### Cosmic Feed
Stay up to date with the universe:
- Real-time data from **NASA**, **SpaceX**, and **asteroid APIs**
- “Astronomy Picture of the Day” integration
- Save events to your personal collection or star map

### Star Map Builder
- Interactive visualization of planets, stars, comets, and launches  
- Add or customize cosmic objects with 3D rendering (Three.js / Mapbox)
- Track your saved events across the sky

### Space Forum
- Discussion boards for astronomy, space exploration, and astrophotography  
- Moderation tools and user reputation system  
- Likes, replies, and achievements for active participation

### AI AstroBot & Quizzes
- AI-generated quizzes, facts, and space trivia  
- Personalized “astro learning paths”  
- Gain experience points (XP) and rank up (e.g. *Stargazer → Cosmonaut → Commander*)

### Notifications
- Receive alerts about rocket launches, meteor showers, or new APOD photos  
- Optional email or browser push notifications

---

## Authentication & Roles

**JWT-based authentication** with three roles:
- `user` — basic access to feed, quizzes, and forum  
- `moderator` — can manage posts and discussions  
- `admin` — full system control (manage users, events, and APIs)

---

## Tech Stack

| Layer | Technology                                   |
|-------|----------------------------------------------|
| **Frontend** | React                                        |
| **Backend** | Django REST Framework, Node JS               |
| **Database** | PostgreSQL                                   |
| **Auth** | JWT                                          |
| **External APIs** | NASA APOD, SpaceX Launch Library, NASA NeoWs |
| **AI Integration** | OpenAI API                                   |
| **3D / Maps** | Three.js / Mapbox                            |
| **Notifications** | Email / Push via external service            |

---

## Project Structure

---

## API Integrations
API	Purpose
NASA APOD - Astronomy Picture of the Day
NASA NeoWs - Asteroid tracking
SpaceX Launches - Real-time rocket launch info
OpenAI API - Quiz & content generation (maybe)
Mapbox / Three.js - 3D Star Map visualization (maybe)

