class YouTubeOldLayout {
  
    constructor() {
        console.log("Loaded Old YouTube Layout");

        const app = document.documentElement;
        this.pageObserver.observe(app, { childList: true, subtree: true, attributes: false });

        this.setLayout();
        this.moveButtons();
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

            if (bottomGrid && secondaryInner) {
                secondaryInner.replaceWith(bottomGrid);
                below.appendChild(secondaryInner);
            }
        }
    }

    /**
     * Moves buttons
     */
    moveButtons() {
        const owner = document.querySelector("ytd-watch-grid #secondary-inner ytd-video-owner-renderer");
        const bottomActions = document.querySelector("ytd-watch-grid #secondary-inner #bottom-actions");
        if (owner && bottomActions) {
            const menu = bottomActions.querySelector("ytd-menu-renderer");
            if (menu) {
                owner.after(bottomActions.querySelector("ytd-menu-renderer"));
                bottomActions.remove();
            }
        }
    }

    /**
     * Moves chat button to secondary
     */
    moveChat() {
        const chat = document.querySelector("ytd-watch-grid #primary #chat-container");
        const secondary = document.querySelector("ytd-watch-grid #secondary");
        if (chat && secondary && !secondary.contains(chat)) {
            const secondaryFixed = secondary.querySelector("#fixed-secondary");
            secondaryFixed.after(chat);
        }
    }

    /**
     * Gets grid for videos
     * @returns Grid for videos
     */
    getGrid() {
        const grid = document.querySelector("ytd-watch-grid ytd-rich-grid-renderer");

        if (grid) {
            let blockerGrid = grid.querySelector("#blocker-grid");
            if (!blockerGrid) {
                blockerGrid = document.createElement("div");
                blockerGrid.id = "blocker-grid";
                grid.prepend(blockerGrid);
            }

            return blockerGrid;
        }
        
        return null;
    }

    /**
     * Adds Video to grid
     * @param {HTMLElement} video YouTube video 
     */
    addVideo(video) {
        const grid = this.getGrid();
        if (grid) {
            grid.appendChild(video);
        }
    }
    
    pageObserver = new MutationObserver((mList) => {
        for (let m of mList) {
            for (let node of m.addedNodes) {
                switch (node.id) {
                    case "bottom-grid":
                    case "secondary-inner":
                        this.setLayout();
                        break;
                    case "chat-container":
                        this.moveChat();
                        break
                }

                switch (node.nodeName.toLowerCase()) {
                    case "ytd-rich-item-renderer":
                        const grid = this.getGrid();
                        if (grid && !grid.contains(node) && node.closest("ytd-watch-grid")) {
                            this.addVideo(node);
                        }
                    break;
                    case "ytd-menu-renderer":
                        this.moveButtons();
                        break;
                }
            }
        }
    });
  }
  
  var youTubeOldLayout = new YouTubeOldLayout();