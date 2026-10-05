---
title: "TweetPilot"
description: "A personal AI-assisted writing companion for X, built to help create thoughtful, original posts while keeping the final edit and publishing decision with me."
purpose: "Generate concise, personalized tweet ideas around technology and AI, photography, riding, travel, and everyday observations, with a lightweight web creator today and a Chrome extension planned for the X composer."
status: "Active"
links:
  - label: "Tweet Creator"
    url: "https://vtrrk.in/tweet/"
  - label: "GitHub"
    url: "https://github.com/vtrravikumar/tweetpilot"
---

TweetPilot is a personal project for making it easier to turn an idea into a good post for X without turning the process into automated publishing.

The project combines a small Cloudflare Worker backend with an OpenAI-powered generation layer and a simple web interface on vtrrk.in. The generated tweet can be reviewed and edited before it is copied to X, where I make the final decision to publish it.

## Why I'm building it

Posting regularly is easy to postpone. TweetPilot is intended to remove some of the friction while keeping the voice and judgment human.

The initial focus is on topics that naturally fit my interests:

- Technology & AI
- Photography
- Royal Enfield & Riding
- Travel & Exploration
- Life & Observations
- Surprise me

The generator is designed to favour fresh angles, conversational writing and minimal use of hashtags rather than producing generic social-media copy.

## Current status

The first production version of the Tweet Creator is live on vtrrk.in.

It supports:

- topic-based tweet generation;
- optional location context;
- a configurable character limit, currently 140 characters;
- editing before posting;
- generating another variation;
- copying the final text to X.

The first TweetPilot-generated post has also been reviewed and manually published on X. The final X Post action remains deliberately human-controlled.

## What's next

The next major step is the Chrome extension, which will bring the same workflow closer to the native X composer.

The extension is planned to assist with composition, but it will not automatically click X's native Post button. The goal is to keep TweetPilot as an assistant rather than an autonomous publisher.

---

TweetPilot is part of my broader collection of small, practical projects exploring how AI can be useful in everyday creative and technical work.
