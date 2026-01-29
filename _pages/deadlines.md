---
layout: deadlines
title: deadlines
permalink: /deadlines/
description: Track important AI conference and journal submission deadlines
nav: true
nav_order: 2
---

<div id="currtime"></div>
<div id="deadlinesdiv"></div>

<div id="backface"><div id="backfacetext"></div></div>

<div class="mt-4">
  <details>
    <summary>About this tool</summary>
    <p>Thanks to <a href="https://twitter.com/karpathy">@karpathy</a> and Academic Countdown for providing the base versions.</p>
    <p>Based on the <a href="https://github.com/IntelligentSystemsLaboratory/academic_countdown">academic_countdown</a>
    project by the Intelligent Systems Laboratory at University of Bristol.</p>
  </details>
</div>

<script>
  // Wait for jQuery to be loaded before loading deadlines.js
  (function checkJQuery() {
    if (typeof jQuery !== 'undefined') {
      var script = document.createElement('script');
      script.src = '/assets/js/deadlines.js';
      document.body.appendChild(script);
    } else {
      setTimeout(checkJQuery, 50);
    }
  })();
</script>
