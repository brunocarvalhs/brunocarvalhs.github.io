const e=`---
title: Privacy Policy
description: This document describes how we handle your data.
lastUpdated: 2025-06-01
category: privacy
project: Friends Secrets
---

# Data Usage and Deletion Policy

## Data Collection and Usage

In the **Friends Secrets** app, we collect the information you provide directly, including:

- Name  
- Phone number  
- Profile photo (optional)  
- Preferences (list of "likes")  
- Usage data, such as last login  

This information is securely stored using Firebase Authentication and Firestore, encrypted locally using Base64. The encryption key is kept exclusively on your device, ensuring only you have direct access to these data.

The collected data is used to:

- Provide and improve the app services;  
- Authenticate and verify the user's identity;  
- Personalize the experience based on your tastes and preferences.

## Data and Profile Deletion

You can request the deletion of all your personal data and profile at any time directly within the app. To do this:

- Go to the **Profile** tab while logged in;  
- Use the **Delete Account** button.

When you delete your account, all your personal data stored, including phone number, preferences, and profile information, will be permanently removed from Firebase Authentication and Firestore.

## Data Security

We value your privacy and implement technical measures to protect your personal information. However, no method of electronic transmission or storage is 100% secure, so we cannot guarantee absolute security.

## Contact Us

If you have any questions about the collection, usage, or deletion of your data, please contact us at: **brunocarvalhs@outlook.com.br**.
`;export{e as default};
