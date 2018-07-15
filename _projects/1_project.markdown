---
layout: page
title: Arbor Tracing
description: Microglia Tracing
img: /assets/img/12.jpg
---

Motivation: The arbor morphologies of brain microglia are important indicators of cell activation. This paper fills the need for accurate, robust, adaptive, and scalable methods for reconstruct-ing 3-D microglial arbors & quantitatively mapping microglia acti-vation states over extended brain tissue regions.

Results: Thick rat brain sections (100-300m) were multiplex im-munolabeled for IBA1 and Hoechst, and imaged by step-and-repeat confocal microscopy with automated 3-D image mosa-icing, producing seamless images of extended brain regions (e.g., 5,903×9,874×229 voxels). An over-complete dictionary based model was learned for the image-specific local structure of microglial processes. The microglial arbors were reconstructed seamlessly using an automated and scalable algorithm that ex-ploits microglia-specific constraints. This method detected 80.1% and 92.8% more centered arbor points, and 53.5% and 55.5% fewer spurious points than existing vesselness and LoG based methods, respectively, and the traces were 13.1% and 15.5% more accurate based on the DIADEM metric. The arbor morpholo-gies were quantified using Scorcioni’s L-measure. Coifman’s har-monic co-clustering revealed four morphologically distinct clas-ses that concord with known microglia activation patterns. This enabled us to map spatial distributions of microglial activation and cell abundances.

Availability: Experimental protocols, sample datasets, scalable open-source multi-threaded software implementation (C++, MATLAB) in the electronic supplement, and website (www.farsight-toolkit.org). 



<div class="img_row">
    <img class="col three" src="{{ site.baseurl }}/assets/img/12.jpg" alt="" title="example image"/>
</div>
<div class="col three caption">
Illustrating the problem of large-scale microglia reconstruction. (A) Maximum-intensity projection of a 3-D two-channel mosaic image (size 5903 × 9874 × 229 voxels, 3117 microglia, yellow: IBA1, blue: Hoechst). (A1) close-up of the boxed region. (B) Automated reconstructions with microglial soma in red and arbor reconstructions in green. (B1) Close-up of the reconstructions in the boxed region. (C1–C5) Close-ups of individual microglial arbor reconstructions illustrating the diversity of cellular morphologies
</div>

<a href='https://www.ncbi.nlm.nih.gov/pubmed/25701570'> Read here </a>
<p>
<a href='https://github.com/megjhani/BioInformatics'> Source Code </a>

<br/><br/>


