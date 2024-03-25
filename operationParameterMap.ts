type Parameter = {
    name: string
}
type Entry = {
    parameters: Parameter[]
}
export const operationParameterMap: Record<string, Entry> = {
    '/workspaces/{workspace_id}/contacts-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'contact'
            },
        ]
    },
    '/contacts/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/contacts-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
            {
                name: 'filter'
            },
        ]
    },
    '/contacts/{id}/gdpr_destroy-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/contacts/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/contacts/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'contact'
            },
        ]
    },
    '/workspaces/{workspace_id}/contacts/upsert-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'contact'
            },
        ]
    },
    '/contacts/{contact_id}/applied_tags-POST': {
        parameters: [
            {
                name: 'contact_id'
            },
            {
                name: 'contacts_applied_tag'
            },
        ]
    },
    '/contacts/applied_tags/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/contacts/{contact_id}/applied_tags-GET': {
        parameters: [
            {
                name: 'contact_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/contacts/applied_tags/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/contacts/tags-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'contacts_tag'
            },
        ]
    },
    '/contacts/tags/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/contacts/tags-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/contacts/tags/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/contacts/tags/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'contacts_tag'
            },
        ]
    },
    '/courses/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/courses-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/courses/{course_id}/enrollments-POST': {
        parameters: [
            {
                name: 'course_id'
            },
            {
                name: 'courses_enrollment'
            },
        ]
    },
    '/courses/enrollments/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/courses/{course_id}/enrollments-GET': {
        parameters: [
            {
                name: 'course_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/courses/enrollments/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'courses_enrollment'
            },
        ]
    },
    '/courses/lessons/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/courses/sections/{section_id}/lessons-GET': {
        parameters: [
            {
                name: 'section_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/courses/lessons/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'courses_lesson'
            },
        ]
    },
    '/courses/sections/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/courses/{course_id}/sections-GET': {
        parameters: [
            {
                name: 'course_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/courses/sections/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'courses_section'
            },
        ]
    },
    '/workspaces/{workspace_id}/forms-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'form'
            },
        ]
    },
    '/forms/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/forms-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/forms/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'form'
            },
        ]
    },
    '/forms/field_sets/{field_set_id}/fields-POST': {
        parameters: [
            {
                name: 'field_set_id'
            },
            {
                name: 'forms_field'
            },
        ]
    },
    '/forms/fields/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/field_sets/{field_set_id}/fields-GET': {
        parameters: [
            {
                name: 'field_set_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/forms/fields/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/fields/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'forms_field'
            },
        ]
    },
    '/forms/{form_id}/field_sets-POST': {
        parameters: [
            {
                name: 'form_id'
            },
            {
                name: 'forms_field_set'
            },
        ]
    },
    '/forms/field_sets/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/{form_id}/field_sets-GET': {
        parameters: [
            {
                name: 'form_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/forms/field_sets/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/field_sets/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'forms_field_set'
            },
        ]
    },
    '/forms/fields/{field_id}/options-POST': {
        parameters: [
            {
                name: 'field_id'
            },
            {
                name: 'forms_fields_option'
            },
        ]
    },
    '/forms/fields/options/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/fields/options/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/fields/{field_id}/options-GET': {
        parameters: [
            {
                name: 'field_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/forms/fields/options/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'forms_fields_option'
            },
        ]
    },
    '/forms/{form_id}/submissions-POST': {
        parameters: [
            {
                name: 'form_id'
            },
            {
                name: 'forms_submission'
            },
        ]
    },
    '/forms/submissions/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/{form_id}/submissions-GET': {
        parameters: [
            {
                name: 'form_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/forms/submissions/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/submissions/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'forms_submission'
            },
        ]
    },
    '/forms/submissions/{submission_id}/answers-POST': {
        parameters: [
            {
                name: 'submission_id'
            },
            {
                name: 'forms_submissions_answer'
            },
        ]
    },
    '/forms/submissions/answers/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/submissions/{submission_id}/answers-GET': {
        parameters: [
            {
                name: 'submission_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/forms/submissions/answers/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/forms/submissions/answers/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'forms_submissions_answer'
            },
        ]
    },
    '/fulfillments/{id}/cancel-POST': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/fulfillments-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'fulfillment'
            },
        ]
    },
    '/fulfillments/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/fulfillments-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/fulfillments/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'fulfillment'
            },
        ]
    },
    '/workspaces/{workspace_id}/fulfillments/locations-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'fulfillments_location'
            },
        ]
    },
    '/fulfillments/locations/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/fulfillments/locations-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/fulfillments/locations/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/fulfillments/locations/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'fulfillments_location'
            },
        ]
    },
    '/workspaces/{workspace_id}/images-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'image'
            },
        ]
    },
    '/images/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/images-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/images/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/images/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'image'
            },
        ]
    },
    '/orders/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/orders-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
            {
                name: 'filter'
            },
        ]
    },
    '/orders/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'order'
            },
        ]
    },
    '/orders/{order_id}/applied_tags-POST': {
        parameters: [
            {
                name: 'order_id'
            },
            {
                name: 'orders_applied_tag'
            },
        ]
    },
    '/orders/applied_tags/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/orders/{order_id}/applied_tags-GET': {
        parameters: [
            {
                name: 'order_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/orders/applied_tags/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/orders/invoices/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/orders/{order_id}/invoices-GET': {
        parameters: [
            {
                name: 'order_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/orders/invoices/restocks/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/orders/invoices/restocks-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/workspaces/{workspace_id}/orders/tags-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'orders_tag'
            },
        ]
    },
    '/orders/tags/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/orders/tags-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/orders/tags/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/orders/tags/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'orders_tag'
            },
        ]
    },
    '/orders/transactions/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/orders/{order_id}/transactions-GET': {
        parameters: [
            {
                name: 'order_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/workspaces/{workspace_id}/products-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'product'
            },
        ]
    },
    '/products/{id}/archive-POST': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/products/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/products-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/products/{id}/unarchive-POST': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/products/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'product'
            },
        ]
    },
    '/products/{product_id}/prices-POST': {
        parameters: [
            {
                name: 'product_id'
            },
            {
                name: 'products_price'
            },
        ]
    },
    '/products/prices/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/products/{product_id}/prices-GET': {
        parameters: [
            {
                name: 'product_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/products/prices/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'products_price'
            },
        ]
    },
    '/workspaces/{workspace_id}/products/tags-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'products_tag'
            },
        ]
    },
    '/products/tags/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/products/tags/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/products/tags-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/products/tags/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'products_tag'
            },
        ]
    },
    '/products/{product_id}/variants-POST': {
        parameters: [
            {
                name: 'product_id'
            },
            {
                name: 'products_variant'
            },
        ]
    },
    '/products/variants/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/products/{product_id}/variants-GET': {
        parameters: [
            {
                name: 'product_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/products/variants/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'products_variant'
            },
        ]
    },
    '/shipping/location_groups/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/profiles/{profile_id}/location_groups-GET': {
        parameters: [
            {
                name: 'profile_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/workspaces/{workspace_id}/shipping/packages-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'shipping_package'
            },
        ]
    },
    '/shipping/packages/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/shipping/packages-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/shipping/packages/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/packages/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'shipping_package'
            },
        ]
    },
    '/workspaces/{workspace_id}/shipping/profiles-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'shipping_profile'
            },
        ]
    },
    '/shipping/profiles/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/shipping/profiles-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/shipping/profiles/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/profiles/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'shipping_profile'
            },
        ]
    },
    '/shipping/zones/{zone_id}/rates-POST': {
        parameters: [
            {
                name: 'zone_id'
            },
            {
                name: 'shipping_rate'
            },
        ]
    },
    '/shipping/rates/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/zones/{zone_id}/rates-GET': {
        parameters: [
            {
                name: 'zone_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/shipping/rates/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/rates/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'shipping_rate'
            },
        ]
    },
    '/workspaces/{workspace_id}/shipping/rates/names-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'shipping_rates_name'
            },
        ]
    },
    '/shipping/rates/names/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/shipping/rates/names-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/shipping/rates/names/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/rates/names/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'shipping_rates_name'
            },
        ]
    },
    '/shipping/location_groups/{location_group_id}/zones-POST': {
        parameters: [
            {
                name: 'location_group_id'
            },
            {
                name: 'shipping_zone'
            },
        ]
    },
    '/shipping/zones/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/location_groups/{location_group_id}/zones-GET': {
        parameters: [
            {
                name: 'location_group_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/shipping/zones/{id}-DELETE': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/shipping/zones/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'shipping_zone'
            },
        ]
    },
    '/teams-GET': {
        parameters: [
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/teams/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/teams/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'team'
            },
        ]
    },
    '/users/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/users-GET': {
        parameters: [
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/users/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'user'
            },
        ]
    },
    '/workspaces/{workspace_id}/webhooks/outgoing/endpoints-POST': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'webhooks_outgoing_endpoint'
            },
        ]
    },
    '/webhooks/outgoing/endpoints/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/webhooks/outgoing/endpoints-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/webhooks/outgoing/endpoints/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'webhooks_outgoing_endpoint'
            },
        ]
    },
    '/webhooks/outgoing/events/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/workspaces/{workspace_id}/webhooks/outgoing/events-GET': {
        parameters: [
            {
                name: 'workspace_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/teams/{team_id}/workspaces-POST': {
        parameters: [
            {
                name: 'team_id'
            },
            {
                name: 'workspace'
            },
        ]
    },
    '/workspaces/{id}-GET': {
        parameters: [
            {
                name: 'id'
            },
        ]
    },
    '/teams/{team_id}/workspaces-GET': {
        parameters: [
            {
                name: 'team_id'
            },
            {
                name: 'after'
            },
            {
                name: 'sort_order'
            },
        ]
    },
    '/workspaces/{id}-PUT': {
        parameters: [
            {
                name: 'id'
            },
            {
                name: 'workspace'
            },
        ]
    },
}