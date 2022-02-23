
$(document).ready(function () {
    var config = {
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
            primaryColor: '#9f9fdf',
            secondaryColor: '#df9f9f',
            tertiaryColor: '#dfdf9f',
            lineColor: '#4d4db3',
            textColor: 'var(--text-color)',
            titleColor: 'var(--text-color)',
            nodeTextColor: 'var(--background-color)',
            mainBkg: 'var(--text-color)',
            nodeBorder: 'var(--text-color-dark)',
            clusterBkg: 'var(--grey-dark)',
            clusterBorder: 'var(--grey-light)',
        },
    };
    mermaid.initialize(config);
    mermaid.init(undefined, '.language-mermaid');
});
