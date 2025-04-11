import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {TextField2} from "@/app/components/TextField2";

type FormBuilderProps = {
    schema: ZodTypeAny;
    fields: FormField;
    className?: string;
};

type FormField = []

export default function FormBuilder({schema,fields, className}:FormBuilderProps) {
    const {reset,control,handleSubmit, formState: {errors}} = useForm<typeof type>({resolver: zodResolver(schema)});

    const onSubmit = (data: never) => {
        console.log(data);
        reset({});
    };
    return (
          <div className={className}>
              <form onSubmit={handleSubmit(onSubmit)}>
                  {
                      fields.map((f, index) => (
                          <Controller
                              key={index}
                              name={ f.name }
                              control={control}
                              defaultValue={""}
                              render={
                                  ({ field }) => (
                                      <div className="flex flex-col gap-2">
                                          <TextField2
                                              field={{...field}}
                                              name={f.name}
                                              label={f.label}
                                              placeholder={f.placeholder}
                                              type={f.type}
                                              required={f.required}
                                          />
                                          {errors[f.name] && (
                                              <span className="text-red-500">
                                                        {errors[f.name]?.message}
                                                    </span>
                                          )}
                                      </div>
                                  )
                              }

                          />
                      ))
                  }

                  <button type="submit">Login</button>
              </form>
          </div>
    );
}
