# AI Copilot Chat Application with Redux

A React + Redux based AI Copilot chat interface featuring multiple contacts, individual inboxes, message metadata, and a centralized user (agent) model. This project uses dummy data for demonstration and simulates multi-contact conversations in an AI-powered assistant environment.

## Live Demo

Explore the app live at:  
[https://beyond-chat-assignment-r5n4.vercel.app/]

## Overview

This chat application provides an AI assistant interface with the following capabilities:

- **Multi-contact support:** Each contact has its own unique inbox.
- **Message models:** Each message includes metadata such as timestamps, sender/receiver info, and read status.
- **Central user/agent:** A single user (agent) model representing the AI assistant or support agent.
- **Redux state management:** Centralized store managing contacts, messages, and UI states.
- **Dummy data:** Preloaded contacts and message history for demo purposes.
- **Interactive UI:** Includes typing animations, suggested questions, tabbed navigation, and responsive design.

## Features

- **Contact list sidebar:** Select different contacts to view their individual chat history.
- **Chat window:** Displays conversation with message bubbles, sender avatars, and timestamps.
- **Typing animation:** AI assistant replies are animated to simulate typing.
- **Suggested questions:** Quick-reply buttons based on conversation context.
- **Redux integration:** State is managed via Redux slices for contacts, messages, and user.
- **Customizable UI:** Easily extend the design and behavior via components and Redux store.

## Technologies Used

- React (functional components + hooks)  
- Redux Toolkit for state management  
- Tailwind CSS for styling  
- JavaScript (ES6+)  
- Dummy JSON data for contacts and messages

## Getting Started

### Installation

### Clone the repository:

```bash
git clone 'Yet to replace'
cd ai-copilot-redux
Install dependencies:


npm install
# or
yarn install

###Run the development server:


npm start
# or
yarn start