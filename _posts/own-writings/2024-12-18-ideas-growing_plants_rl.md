---
layout: distill
published: false
title: Growing Plants with Reinforcement Learning
description: Can a deep reinforcement learning agent learn to grow plants?
tags: reinforcement-learning
giscus_comments: true
date: 2021-05-22
featured: false
mermaid:
  enabled: true
  zoomable: true
code_diff: true
map: true
chart:
  chartjs: true
  echarts: true
  vega_lite: true
tikzjax: true
typograms: true

authors:
  - name: Veerendrababu Vakkapatla
    url: "https://veerendrav.github.io"
    affiliations:
      name: IIT Bombay

bibliography: 2024-12-18-growing-plants-rl.bib

# Optionally, you can add a table of contents to your post.
# NOTES:
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - we may want to automate TOC generation in the future using
#     jekyll-toc plugin (https://github.com/toshimaru/jekyll-toc).
toc:
  - name: Background
    # if a section has subsections, you can add them as follows:
    subsections:
    - name: How a plant grows
    - name: Reinforcement Learning
  - name: The agent
  - name: The enviornment
  - name: Agent-Environment Loop
  - name: Optimization
  - name: Results
  
  
# Below is an example of injecting additional post-specific styles.
# If you use this post as a template, delete this _styles block.
_styles: >
  .fake-img {
    background: #bbb;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }
  .fake-img p {
    font-family: monospace;
    color: white;
    text-align: left; 
    margin: 12px 0;
    text-align: center;
    font-size: 16px;
  }
---
We are refereing to these papers <d-cite key="hitti2021growspacelearningshapeplants"></d-cite>, <d-cite key="amacker2022learnedsimulationenvironmentmodel"></d-cite>, <d-cite key="balderas2024comparativestudydeepreinforcement"></d-cite>, <d-cite key="nasti2024reinforcement"></d-cite>


