# **App Name**: Monthly Scheduler

## Core Features:

- Data Transformation: Transforms raw input data into a usable data structure of grouped items.
- General Scheduling View: Presents an overview of scheduled items, aggregated daily.
- Detailed Daily Scheduling View: Offers a detailed breakdown of scheduled items by mealtime for each day.
- Dynamic Quantity Input and Validation: Enables users to input daily quantities for each item while validating against a maximum allowed amount using a numerical stepper; uses toast notifications to give feeback to the user
- Real-time Data Aggregation: Calculates and displays totals and remaining available quantities in real-time, updating status indicators accordingly.
- Data Filtering: Allows users to filter items by description, code, or group name, dynamically adjusting the displayed data.
- CSV Export: Generates and exports scheduled data to a CSV file, adapting the format based on the active scheduling view.

## Style Guidelines:

- Primary color: Soft teal (#63B7AF), chosen for its calming and organized feel, promoting focus and balance in the scheduling environment.
- Background color: Light off-white (#F9FAFA), subtly tinted with teal, provides a gentle, non-intrusive backdrop that ensures readability and comfort during extended use.
- Accent color: Mustard yellow (#D6A756), chosen for visual contrast, guiding user attention to CTAs, alerts, and selected interactive elements; this choice contributes to the functionality of a detailed planning context.
- Body and headline font: 'Inter' (sans-serif), providing a modern, clean, and highly readable text for both headlines and body content, suitable for data-rich scheduling.
- Utilize minimalist, line-based icons for actions and status indicators; clear, unambiguous icons ensure clarity in this detailed view, such as icons for Check, Warning, ChevronDown, Search, Export.
- Maintain a structured, table-based layout with sticky columns to enhance data comparison and navigation; this decision emphasizes organization and quick data location within the complex view.
- Implement subtle animations for toasts (fade-in-up), table rows (slide-down-fade-in), and hover effects to enhance usability without being distracting. Transition effects keep the layout intuitive for data changes or status alerts.