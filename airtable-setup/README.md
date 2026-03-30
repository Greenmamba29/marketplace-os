# GrahmOS Virtual Mall - Airtable Setup

This repository contains the complete Airtable data structure and seed data for the GrahmOS Virtual Mall, consisting of 20 B2B marketplaces.

## Structure

- `schema.json`: Defines the Airtable base and table structure for both the Mall Directory and individual Marketplaces.
- `mall-directory.json`: The master directory mapping all 20 stores to their verticals, wings, and Netlify URLs.
- `seed-data/`: Contains one JSON file per marketplace with 15-20 realistic product/supplier records.
- `setup.sh`: A shell script to automate the creation of all 21 Airtable bases and populate them with seed data using the Airtable REST API.

## Marketplace Verticals
The mall includes 20 specialized marketplaces:
- **Tier 1 (Grand Concourse)**: Industrial MRO, Specialty Chemicals, Construction, Healthcare, EV & Clean Energy, Lithium Materials.
- **Tier 2 (Main Hall)**: Food Distribution, Packaging, Agri-Inputs, Lab Supplies, Heavy Equipment, Home Care Staffing, Gov Procurement, Surplus Assets.
- **Tier 3 (Specialty Arcade)**: Network Hardware, Security Systems, B2B Uniforms, Office Furniture, Food Ingredients, Bulk Spirits.

## Setup Instructions

### 1. Requirements
- `curl` and `jq` installed on your system.
- An Airtable Personal Access Token with `schema.bases:write` and `data.records:write` scopes.
- Your Airtable Workspace ID (found in the URL when viewing a workspace).

### 2. Environment Variables
Set your Airtable credentials:

```bash
export AIRTABLE_TOKEN="your_personal_access_token"
export AIRTABLE_WORKSPACE_ID="your_workspace_id"
```

### 3. Run the Setup
Execute the setup script to build the virtual mall:

```bash
chmod +x setup.sh
./setup.sh
```

The script will:
1. Create the **GrahmOS Mall Directory** base.
2. Create 20 individual bases for each marketplace.
3. Populate all tables with the provided seed data.

## Data Realism
The seed data has been meticulously crafted to follow vertical-specific requirements:
- Chemical CAS numbers and purity specs.
- Construction ASTM and DOT certifications.
- Medical FDA 510(k) and NIOSH clearance codes.
- Food FSMA and SQF compliance data.
- Heavy equipment emissions and HP specs.
- And more.
