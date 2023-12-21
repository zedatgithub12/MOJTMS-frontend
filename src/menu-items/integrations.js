// assets
import { IconBrandChrome, IconHelp, IconSocial } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconSocial };

// ==============================|| A GROUP OF EXTERNAL INTEGRATION ||============================== //

const integrations = {
    id: 'sample-docs-roadmap',
    title: 'Integrated with',
    type: 'group',
    children: [
        {
            id: 'social-media',
            title: 'Social Media',
            type: 'item',
            url: '/sample-page',
            icon: icons.IconSocial,
            breadcrumbs: false
        }
    ]
};

export default integrations;
