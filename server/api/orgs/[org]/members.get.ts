import { defineEventHandler } from 'h3';
import { unsealSession } from '../../../../utils/authkit-session';
import { createWorkos } from '../../../../utils/workos';
import { listMembers } from '../../../../lib/orgs';

export default defineEventHandler(async (event) => {
    const session = await unsealSession(event);
    if (!session) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const orgId = event.context.params?.org as string;
    if (!orgId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing organization ID' });
    }

    const workos = createWorkos(event);
    const members = await listMembers(workos, orgId);

    // The schema expects a different shape, for now we just return members
    // A further refactor could align the schemas or the service layer.
    return members;
});
