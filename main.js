class YouTubeOldLayout {
  
    constructor() {
        console.log("Loaded Old YouTube Layout");

        this.setLayout();

        const app = document.documentElement;
        this.pageObserver.observe(app, { childList: true, subtree: true, attributes: false });
    }

    /**
     * Sets the layout of YouTube video player to old layout
     */
    async setLayout() {
        const below = document.querySelector("ytd-watch-grid #primary #below");
        const secondary = document.querySelector("ytd-watch-grid #secondary");
    
        if (below && secondary) {
            const bottomGrid = document.querySelector("ytd-watch-grid #bottom-grid");
            const secondaryInner = secondary.querySelector("#secondary-inner");

            secondaryInner.replaceWith(bottomGrid);
            below.appendChild(secondaryInner);

            this.moveButtons();

            const bb = secondary.getBoundingClientRect();
            const fixedSecondary = document.querySelector("ytd-watch-grid ytd-fixed-secondary");
            fixedSecondary.width = bb.width;
            fixedSecondary.left = bb.left;
        }
    }

    /**
     * Moves buttons
     */
    moveButtons() {
        const owner = document.querySelector("#secondary-inner ytd-video-owner-renderer");
        const bottomActions = document.querySelector("#secondary-inner #bottom-actions");
        if (owner && bottomActions) {
            owner.after(bottomActions.querySelector("ytd-menu-renderer"));
            bottomActions.remove();
        }
    }

    /**
     * Gets grid for videos
     * @returns Grid for videos
     */
    getGrid() {
        const grid = document.querySelector("ytd-watch-grid ytd-rich-grid-renderer");

        let blockerGrid = grid.querySelector("#blocker-grid");
        if (!blockerGrid) {
            blockerGrid = document.createElement("div");
            blockerGrid.id = "blocker-grid";
            grid.prepend(blockerGrid);
        }

        return blockerGrid;
    }

    /**
     * Adds Video to grid
     * @param {HTMLElement} video YouTube video 
     */
    addVideo(video) {
        const grid = this.getGrid();
        grid.appendChild(video);
    }
    
    pageObserver = new MutationObserver((mList) => {
        for (let m of mList) {
            for (let node of m.addedNodes) {
                if (node.id && node.id == "primary" || node.id == "secondary") {
                    this.setLayout();
                } else if (node.nodeName.toLowerCase() == "ytd-rich-item-renderer" && !node.hasAttribute("video-layout")) {
                    node.setAttribute("video-layout", "");
                    
                    this.addVideo(node);
                }
            }
        }
    });
  }
  
  var youTubeOldLayout = new YouTubeOldLayout();