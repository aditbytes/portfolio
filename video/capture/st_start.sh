#!/bin/bash
# Expects a clone of https://github.com/aditbytes/Demand_IQ next to this script (./Demand_IQ).
cd "$(dirname "$0")/Demand_IQ"
nohup python3 -m streamlit run dashboard/app.py --server.headless true --server.port 8501 --browser.gatherUsageStats false --theme.base light --client.toolbarMode viewer > ../st.log 2>&1 &
