---
layout: page
title: Spectral Unmixing
description: Morphological Constrained Spectral Unmixing
img: /assets/img/21.png
---

 Motivation: Current spectral unmixing methods for multiplex fluorescence microscopy have a lim-ited ability to cope with high spectral overlap as they only analyze spectral information over individ-ual pixels. Here, we present adaptive Morphologically Constrained Spectral Unmixing (MCSU) al-gorithms that overcome this limitation by exploiting morphological differences between sub-cellular structures, and their local spatial context.

Results: The proposed method was effective at improving spectral unmixing performance by ex-ploiting: (i) a set of dictionary-based models for object morphologies learned from the image data; and (ii) models of spatial context learned from the image data using a total variation algorithm. The method was evaluated on multi-spectral images of multiplex-labeled pancreatic ductal adenocar-cinoma (PDAC) tissue samples. The former constraint ensures that neighbouring pixels corre-spond to morphologically similar structures, and the latter constraint ensures that neighbouring pixels have similar spectral signatures. The average Mean Squared Error (MSE) and Signal to Re-construction Error (SRE) ratio of the proposed method was 39.6% less and 8% more, respectively, compared to the best of all other algorithms that do not exploit these spatial constraints.

Availability: Specimen preparation and imaging protocols, open source software (MATLAB), and website (www.farsight-toolkit.org) Contact: B. Roysam (broysam@central.uh.edu)





<div class="img_row">
    <img class="col three" src="{{ site.baseurl }}/assets/img/21.png" alt="" title=""/>
</div>
<div class="col three caption">
Illustrating the ability of the learned dictionary atoms to capture the morphologies of structures for the channels shown in Figure 2. The first column shows the reference images (R1–R8) from Figure 2, displayed using the same color scheme. The remaining columns show sample dictionary atoms. It is clear from these examples that the dictionary atoms capture the distinct morphologies of the reference images	
</div>

<div class="img_row">
    <img class="col three" src="{{ site.baseurl }}/assets/img/22.png" alt="" title=""/>
</div>
<div class="col three caption">
Performance of different algorithms as measured by the Mean Squared Error (MSE), Signal Reconstruction Error (SRE) ratio and Feature Similarity (FSIM) index. Panels (A–C) show the performance of the algorithms as the noise level was varied. The proposed MCSU and MCSU-TV algorithms have low MSE, high SRE and high FSIM. All of the algorithms performed poorly when the signal to noise ratio was low (2) and the performance improved with increase in SNR. Panels (D–F) show the performance of different algorithms with varying number of end members. The algorithms that utilize the contextual information (MCSU, MCSU-TV and Total Variation) performed better than the algorithms that were not leveraging the contextual information
</div>

<a href='https://www.ncbi.nlm.nih.gov/pubmed/28334208'> Read here </a> 
<p>
<a href = 'https://github.com/megjhani/Unmixing_MCSU.git'> Source Code </a>


