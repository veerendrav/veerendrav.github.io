---
layout: distill
published: true
title:  Training RL agents with sparse rewards
description: 
tags: [reinforcement-learning]
categories: [own-writings]
giscus_comments: true
date: 2025-02-04
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
  - name: Sparse reward environments
  - name: Challenges
  - name: A case study-DDQN with Four Rooms environment
  
  
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





<!-- We are refereing to these papers <d-cite key="hitti2021growspacelearningshapeplants"></d-cite>, <d-cite key="amacker2022learnedsimulationenvironmentmodel"></d-cite>, <d-cite key="balderas2024comparativestudydeepreinforcement"></d-cite>, <d-cite key="nasti2024reinforcement"></d-cite>

1. Variational inference - Sergey levine
2. Variational inference tutorial - neurips 2016
3. This playlist(https://youtube.com/playlist?list=PLF3yxPOY1vv5EfWANmwb5CaWR-5c54Fg4&si=HO9Qq9Jm0dV41faB)
4. https://mpatacchiola.github.io/blog/2021/01/25/intro-variational-inference.html -->