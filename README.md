Team KajuKatli
Team Leader:- Dhananjay Thakare CSE(IoT) I-year YCCE
Team Members:
1. Ishan Bhasme IT II-Year YCCE
2. Yugantar Runghe IT II-Year YCCE
3. Sahil Parate CSE(DS) II-year St. Vincent Palloti College of Engineering & Technology,Nagpur


MargaSanchār – Smart Public Transport Tracking & Prediction System

Inclusive Mobility for Tier-2 & Tier-3 Cities

Overview

MargaSanchār is a smart, inclusive public transport system that provides **real-time bus tracking**, **offline access via SMS/IVR**, and **AI-powered demand prediction** for small and medium-sized cities. It bridges the digital divide by enabling accessibility for all passengers — even without internet.

Problem

* No reliable ETA or tracking for buses in smaller cities.
* Overcrowding and inefficient bus scheduling.
* Feature-phone users left out of digital systems.
* Lack of predictive data for operators.

Solution

A unified digital platform that:

1. Tracks buses live using GPS APIs.
2. Provides QR-based and SMS/IVR access for passengers.
3. Uses ML to predict demand and optimize scheduling.
4. Gives operators analytics for better resource management.

Core Features

Passenger-Side:

* QR-based stop info & live tracking
* Offline SMS/IVR access
* Trip planner & crowd-level insights

**Operator-Side:**

* Dynamic bus scheduling
* Demand forecasting (AI models)
* Route optimization & dashboards


Technology Stack

* **Frontend:** HTML, CSS, JavaScript, TailwindCSS
* **Backend:** Flask / FastAPI
* **Database:** PostgreSQL / TimescaleDB
* **ML Models:** Prophet
* **APIs:** Google Maps, Twilio(SMS/IVR)
* **Hosting:** Vercel (Frontend)

 Architecture

```
[QR/SMS/IVR/Web App]
      ↓
[Backend API – Flask/FastAPI]
      ↓
[Database – PostgreSQL]
      ↓
[ML Engine – Demand + ETA Prediction]
      ↓
[Dashboard + Passenger APIs]
```

Impact

* **Passengers:** Shorter waits, offline access, safety
* **Operators:** Smart scheduling, reduced empty runs
* **Government:** Better planning, less congestion, sustainability

